const ObservedArray = require('../observed-array');

module.exports.iceCandidates = new ObservedArray();
module.exports.peers = new ObservedArray();
module.exports.pendingPeers = new ObservedArray();
module.exports.timeouts = {};
module.exports.writers = {};
