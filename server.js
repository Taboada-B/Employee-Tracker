const inquirer = require ('inquirer');

const express = require('express');

const app = express();
const PORT = 3001;

app.use(express.static('public'));

app.listen(PORT, () =>
  console.log(`Serving static asset routes on port ${PORT}!`)
);





inquirer
  .prompt([
    /* Pass your questions in here */
  ])
  .then((answers) => {
    // Use user feedback for... whatever!!
  })
  .catch((error) => {
    if (error.isTtyError) {
      // Prompt couldn't be rendered in the current environment
    } else {
      // Something else went wrong
    }
  });

// inquirer@8.2.4