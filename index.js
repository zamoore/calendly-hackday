'use strict';

require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.post('/', (req, res) => {
  req.body.payload.questions_and_answers.forEach((qa) => {
    console.log(qa);
  });
});

app.listen(process.env.PORT || 3000, () => console.log('Listening.'));
