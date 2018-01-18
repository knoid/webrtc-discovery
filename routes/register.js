const querystring = require('querystring');
const { pendingPeers, timeouts } = require('./data');
const uuid = require('uuid/v4');

module.exports = (req, res) => {
  const privateId = uuid();
  const publicId = uuid();

  const data = Object.assign({ publicId }, req.body.data);
  pendingPeers.add({ privateId, data });

  timeouts[privateId] = setTimeout(() => {
    delete timeouts[privateId];
    pendingPeers.remove(p => p.privateId === privateId);
  }, 30 * 1000); // 30 seconds

  const { protocol, headers: { host } } = req;
  res.json({
    feed: `${protocol}://${host}/feed?` + querystring.stringify({ privateId }),
    privateId,
  });
};
