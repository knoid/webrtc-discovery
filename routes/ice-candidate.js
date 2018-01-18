const { iceCandidates } = require('./data');

module.exports = (req, res) => {
  iceCandidates.add(req.body.data);
  res.json({ status: 200 })
};
