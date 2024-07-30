// server.js
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

const mainMenuQuestions = [
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

const addDepartmentQuestions = [
    {
        type: 'input',
        name: 'departmentName',
        message: 'What department would you like to add?',
    },
];

const addEmployeeQuestions = [
    {
        type: 'input',
        name: 'firstName',
        message: "What is the employee's first name?",
    },
    {
        type: 'input',
        name: 'lastName',
        message: "What is the employee's last name?",
    },
    {
        type: 'input',
        name: 'roleId',
        message: "What is the employee's role ID?",
    },
    {
        type: 'input',
        name: 'managerId',
        message: "What is the employee's manager ID (null if no manager)?",
        default: null,
    },
];

function promptUser() {
    inquirer.prompt(mainMenuQuestions)
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
                    promptAddDepartment();
                    break;
                case 'add a role':
                    // Add functionality for adding a role
                    break;
                case 'add an employee':
                    promptAddEmployee();
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

function promptAddDepartment() {
    inquirer.prompt(addDepartmentQuestions)
        .then((answers) => {
            addDepartment(answers.departmentName);
        })
        .catch((error) => {
            console.log('Something went wrong. Error:', error);
        });
}

function addDepartment(departmentName) {
    pool.query('INSERT INTO department (name) VALUES ($1) RETURNING *;', [departmentName], (err, res) => {
        if (err) {
            console.error('Error adding department:', err);
        } else {
            console.log(`Department ${departmentName} added successfully!`);
            console.table(res.rows);
            promptUser();
        }
    });
}

function promptAddEmployee() {
    inquirer.prompt(addEmployeeQuestions)
        .then((answers) => {
            addEmployee(answers);
        })
        .catch((error) => {
            console.log('Something went wrong. Error:', error);
        });
}

function addEmployee({ firstName, lastName, roleId, managerId }) {
    pool.query('INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4) RETURNING *;', 
        [firstName, lastName, roleId, managerId], 
        (err, res) => {
            if (err) {
                console.error('Error adding employee:', err);
            } else {
                console.log(`Employee ${firstName} ${lastName} added successfully!`);
                console.table(res.rows);
                promptUser();
            }
        }
    );
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
    pool.query(
        `SELECT 
            e.id, 
            e.first_name, 
            e.last_name, 
            r.title, 
            d.name AS department, 
            r.salary, 
            CONCAT(m.first_name, ' ', m.last_name) AS manager
        FROM 
            employee e
        LEFT JOIN 
            role r ON e.role_id = r.id
        LEFT JOIN 
            department d ON r.department_id = d.id
        LEFT JOIN 
            employee m ON e.manager_id = m.id;`,
        (err, res) => {
            if (err) {
                console.error('Error fetching employees:', err);
            } else {
                console.log('');
                console.table(res.rows);
                promptUser();
            }
        }
    );
}
