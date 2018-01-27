const { iceCandidates, peers, pendingPeers, timeouts, writers } = require('./data');

module.exports = (req, res) => {
  const { privateId } = req.query;
  if (!timeouts.hasOwnProperty(privateId)) {
    return res.json({ status: 404 });
  }

  const send = writers[privateId] = (action, data, sender) => {
    setPingTimeout();
    res.write('data: ' + JSON.stringify({ action, data, sender }) + '\n\n');
  }

  let pingTimeout;
  function setPingTimeout() {
    clearTimeout(pingTimeout);
    pingTimeout = setTimeout(() => {
      send('ping', 'pong');
      setPingTimeout();
    }, 30 * 1000);
  }

  clearTimeout(timeouts[privateId]);
  delete timeouts[privateId];
  const player = pendingPeers.remove(p => p.privateId === privateId);
  peers.add(player);

  res.type('text/event-stream');
  res.flushHeaders();

  const peersObserver = peers.observe();
  peersObserver.on('add', (peer) => {
    if (peer.privateId !== privateId) {
      send('add', peer.data);
    }
  });

  peersObserver.on('remove', (peer) => {
    send('remove', peer.data);
  });

  const iceCandidatesObserver = iceCandidates.observe();
  iceCandidatesObserver.on('add', ({ iceCandidate }) => {
    send('iceCandidate', iceCandidate);
  });

  res.on('close', () => {
    clearTimeout(pingTimeout);
    iceCandidatesObserver.cancel();
    peersObserver.cancel();
    peers.remove(p => p.privateId === privateId);
    delete writers[privateId];
  });
};
