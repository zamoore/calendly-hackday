'use strict';

require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const validator = require('validator');
const sgMail = require('@sendgrid/mail');

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const validateLinkedIn = (url) => {
  return validator.isURL(url) ? undefined : ['Invalid URL'];
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
  let { payload } = req.body;

  let issues = payload.questions_and_answers.reduce((acc, qa) => {
    let issue = fieldMapping[qa.question](qa.answer);

    if (issue) {
      acc.push(issue);
    }

    return acc;
  }, []);

  if (!issues.length) {
    return res.send('No issues');
  }

  let issueHtmlString = issues.reduce((acc, issueArr) => {
    issueArr.forEach((issue) => {
      acc = acc + `<li>${issue}</li>`;
    });

    return acc;
  }, '');

  issueHtmlString = `<ul>${issueHtmlString}</ul>`;
  issueHtmlString = `
    <h1>${payload.invitee.email} - ${payload.invitee.name}</h1>
    <p>Meeting scheduled at ${payload.event.start_time_pretty} and assigned to ${payload.event.assigned_to}.</p>
    ${issueHtmlString}
  `;

  let msg = {
    to: 'zack.moore@izea.com',
    from: 'zack.moore@izea.com',
    subject: 'Bogus Meeting',
    html: issueHtmlString
  };
  sgMail.send(msg);

  res.send('Ok');
});

app.listen(process.env.PORT || 3000, () => console.log('Listening.'));
