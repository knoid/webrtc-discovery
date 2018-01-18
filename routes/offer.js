const { peers, writers } = require('./data');

module.exports = (req, res) => {
  const { privateId, data: { description, publicId } } = req.body;

  // does the sender exist?
  const sender = peers.find(p => p.privateId === privateId);

  // does the recipient exist?
  const recipient = peers.find(p => p.data.publicId === publicId);

  if (!sender || !recipient) {
    return res.json({ status: 404 });
  }

  writers[recipient.privateId]('offer', description, sender.data.publicId);
  res.json({ status: 200 });
};
