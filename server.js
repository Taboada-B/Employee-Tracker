const express = require('express');
const inquirer = require('inquirer');
const dotenv = require('dotenv');
const apiRoutes = require('./routes/apiRoutes');
const pool = require('./config/dbConfig');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;


// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use('/api', apiRoutes);

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  // Starting the function 
promptUser();
});


const main = {
    type: 'list',
    name: 'mainMenu',
    message: 'What would you like to do?',
    choices: [
        'view all deparments', 
        'view all roles', 
        'view all employees', 
        'add a department',
        'add a role', 
        'add an employee', 
        'update an employee role'
    ],

};

function promptUser() {
inquirer
    .prompt([main])

    .then( async (answers) => {

        switch (answers.mainMenu) {
            case 'view all deparments':
                await viewAllDepartments();
                break;

            case 'view all roles':
                

                break;

            case 'view all employees':
                

                break;

            case 'add a department':
                

                break;

            case 'add a role':
                

                break;

            case 'add an employee':
                

                break;

            case 'update an employee role':
                

                break;


            default:
                break;
        }

    })

    .catch((error) => {
            console.log('Something went wrong. Error:', error);
    });

}

async function viewAllDepartments() {
    try {
      const response = await fetch('http://localhost:3001/api/department');
      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error('Error fetching departments:', error);
    }
  };

