'use strict';

require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const validator = require('validator');

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const validateEmail = (email) => {

};

const validateLinkedIn = (url) => {
  return validator.isUrl(url) : undefined ? ['Invalid URL'];
};
const validateBudget = (budget) => {
  let issues = [];

  if (!validator.isCurrency(budget)) {
    issues.push('Budget entered is not recognizable as currency.')
  }
  if (budget.length < 2) {
    issues.push('Budget entered is less than 2 characters.')
  }

  return issues.length ? issues : undefined;
};
const validateTitle = (title) => {
  return title.length > 1 ? undefined : ['Title is only one character.'];
};
const validateCompany = (company) => {
  return company.length > 1 ? undefined : ['Company is only one character.'];
};

const fieldMapping = {
  'Your LinkedIn Profile URL': validateLinkedIn,
  'Title/Role': validateTitle,
  'Company': validateCompany,
  'Budget': validateBudget
};

app.post('/', (req, res) => {
  let issues = req.body.payload.questions_and_answers.reduce((acc, qa) => {
    let issue = fieldMapping[qa.question](qa.answer);

    if (issue) {
      acc.push(issue);
    }

    return acc;
  }, []);

  console.log(issues);
});

app.listen(process.env.PORT || 3000, () => console.log('Listening.'));
