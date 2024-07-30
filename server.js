const express = require('express');
const inquirer = require('inquirer');
const dotenv = require('dotenv');
const apiRoutes = require('./routes/apiRoutes');
const { Pool } = require('pg');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use('/api', apiRoutes);

const pool = new Pool({
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    host: 'localhost',
    database: 'tracker',
    port: process.env.DB_PORT || 5432,
});

pool.connect((err) => {
    if (err) {
        console.error('Error connecting to the database', err);
    } else {
        console.log('Connected to the tracker database!');
    }
});

// Default response for any other request (Not Found)
app.use((req, res) => {
    res.status(404).end();
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
    // Starting the function
    promptUser();
});

const questions = [
    {
        type: 'list',
        name: 'mainMenu',
        message: 'What would you like to do?',
        choices: [
            'view all departments',
            'view all roles',
            'view all employees',
            'add a department',
            'add a role',
            'add an employee',
            'update an employee role'
        ]
    },
];

function promptUser() {
    inquirer.prompt(questions)
        .then((answers) => {
            switch (answers.mainMenu) {
                case 'view all departments':
                    viewAllDepartments();
                    break;
                case 'view all roles':
                    viewAllRoles();
                    break;
                case 'view all employees':
                    viewAllEmployees();
                    break;
                case 'add a department':
                    // Add functionality for adding a department
                    addDepartment(answers.a);
                    break;
                case 'add a role':
                    // Add functionality for adding a role
                    break;
                case 'add an employee':
                    // Add functionality for adding an employee
                    break;
                case 'update an employee role':
                    // Add functionality for updating an employee role
                    break;
                default:
                    console.log('Option not implemented');
                    break;
            }

        })
        .catch((error) => {
            console.log('Something went wrong. Error:', error);
        });
}

function viewAllDepartments() {
    pool.query('SELECT id, name FROM department;', (err, res) => {
        if (err) {
            console.error('Error fetching departments:', err);
        } else {
            console.log('');
            console.table(res.rows);
            promptUser();
        }
    });
}

function viewAllRoles() {
    pool.query('SELECT id, title, salary FROM role;', (err, res) => {
        if (err) {
            console.error('Error fetching roles:', err);
        } else {
            console.log('');
            console.table(res.rows);
            promptUser();
        }
    });
}

function viewAllEmployees() {
    pool.query('SELECT * FROM employee;', (err, res) => {
        if (err) {
            console.error('Error fetching departments:', err);
        } else {
            console.log('');
            console.table(res.rows);
            promptUser();
        }
    });


}