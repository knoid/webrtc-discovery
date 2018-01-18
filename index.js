const bodyParser = require('body-parser');
const cors = require('cors');
const express = require('express');
const routes = require('./routes');

const PORT = process.env.PORT || 3000;

express()
  .use(cors())
  .use(bodyParser.json())

  .post('/answer', routes.answer)
  .get('/feed', routes.feed)
  .post('/iceCandidate', routes.iceCandidate)
  .post('/offer', routes.offer)
  .post('/register', routes.register)

  .listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`Server listening on port ${PORT}`);
  });
