'use strict';

require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send(req.body);
});

app.listen(process.env.PORT || 3000, () => console.log('Listening.'));
