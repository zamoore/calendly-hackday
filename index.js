'use strict';

require('dotenv').config();

const express = require('express');

const app = express();

app.get('/', (req, res) => {
  res.send('hello');
});

app.listen(process.env.port || 3000, () => console.log('Listening.'));
