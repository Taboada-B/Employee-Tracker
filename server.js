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
                    addDepartment();
                    break;
                case 'add a role':
                    // Add functionality for adding a role
                    addRole();
                    break;
                case 'add an employee':
                    // Add functionality for adding an employee
                    addEmployee();
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
        });
}

function addDepartment() {
    inquirer.prompt([
        {
            type: 'input',
            name: 'departmentName',
            message: 'What is the name of the department?',
        }
    ]).then(answer => {
        pool.query('INSERT INTO department (name) VALUES ($1) RETURNING id', [answer.departmentName], (err, res) => {
            if (err) {
                console.error('Error adding department:', err);
            } else {
                console.log(`Added department with id: ${res.rows[0].id}`);
                promptUser();
            }
        });
    }).catch((error) => {
        console.log('Something went wrong. Error:', error);
    });
}

function addRole() {
    pool.query('SELECT id, name FROM department;', (err, res) => {
        if (err) {
            console.error('Error fetching departments:', err);
        } else {
            const departments = res.rows.map(department => ({
                name: department.name,
                value: department.id
            }));

            inquirer.prompt([
                {
                    type: 'input',
                    name: 'roleTitle',
                    message: 'What is the name of the role?',
                },
                {
                    type: 'input',
                    name: 'roleSalary',
                    message: 'What is the salary of the role?',
                },
                {
                    type: 'list',
                    name: 'departmentId',
                    message: 'Which department does this role belong to?',
                    choices: departments
                }
            ]).then(answers => {
                pool.query('INSERT INTO role (title, salary, department_id) VALUES ($1, $2, $3) RETURNING id', [answers.roleTitle, answers.roleSalary, answers.departmentId], (err, res) => {
                    if (err) {
                        console.error('Error adding role:', err);
                    } else {
                        console.log(`Added role with id: ${res.rows[0].id}`);
                        promptUser();
                    }
                });
            }).catch((error) => {
                console.log('Something went wrong. Error:', error);
            });
        }
    });
}

function addEmployee() {
    pool.query('SELECT id, title FROM role;', (err, roleRes) => {
        if (err) {
            console.error('Error fetching roles:', err);
        } else {
            const roles = roleRes.rows.map(role => ({
                name: role.title,
                value: role.id
            }));

            pool.query('SELECT id, first_name, last_name FROM employee;', (err, empRes) => {
                if (err) {
                    console.error('Error fetching employees:', err);
                } else {
                    const employees = empRes.rows.map(emp => ({
                        name: `${emp.first_name} ${emp.last_name}`,
                        value: emp.id
                    }));
                    employees.unshift({ name: 'None', value: null });

                    inquirer.prompt([
                        {
                            type: 'input',
                            name: 'firstName',
                            message: "What is their first name?",
                        },
                        {
                            type: 'input',
                            name: 'lastName',
                            message: "What is their last name?",
                        },
                        {
                            type: 'list',
                            name: 'roleId',
                            message: "What is the employee's role?",
                            choices: roles
                        },
                        {
                            type: 'list',
                            name: 'managerId',
                            message: "Who is their manager?",
                            choices: employees
                        }
                    ]).then(answers => {
                        pool.query('INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4) RETURNING id', [answers.firstName, answers.lastName, answers.roleId, answers.managerId], (err, res) => {
                            if (err) {
                                console.error('Error adding employee:', err);
                            } else {
                                console.log(`Added employee with id: ${res.rows[0].id}`);
                                promptUser();
                            }
                        });
                    }).catch((error) => {
                        console.log('Something went wrong. Error:', error);
                    });
                }
            });
        }
    });
}
