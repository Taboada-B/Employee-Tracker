const inquirer = require('inquirer');
const express = require('express');

const { Pool } = require('pg');

const PORT = process.env.PORT || 3001;
const app = express();

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const pool = new Pool(

    {
        user: 'postgres',
        password: '',
        host: 'localhost',
        database: 'tracker'
    },

    console.log(`Connected to the books_db database.`)

)

pool.connect();

// app.get('/api/department', (req, res) => {
//     pool.query('SELECT * FROM department', function (err, { rows }) {
//         console.log(rows); // res.json(rows)
//     });

// })

// pool.query('SELECT * FROM reviews', function (err, { rows }) {
//     console.log(rows);
// });

// app.use((req, res) => {
//     res.status(404).end();
// });

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});



const main = {
    type: 'list',
    name: 'mainMenu',
    message: 'What would you like to do?',
    choices: ['view all deparments', 'view all roles', 'view all employees', 'add a department',
        'add a role', 'add an employee', 'update an employee role'],

}



inquirer
    .prompt([main])
    .then((answers) => {
        switch (answers.mainMenu) {
            case 'view all deparments':
                // how to bring up all deparments from schema? 
                app.get('/api/department', (req, res) => {
                    pool.query('SELECT * FROM department', function (err, { rows }) {
                        console.log(rows); // res.json(rows)
                    });

                })
                console.log('1');
                break;

            case 'view all roles':
                console.log('2');

                break;

            case 'view all employees':
                console.log('3');

                break;

            case 'add a department':
                console.log('4');

                break;

            case 'add a role':
                console.log('5');

                break;

            case 'add an employee':
                console.log('6');

                break;

            case 'update an employee role':
                console.log('7');

                break;


            default:
                break;
        }

        console.log(answers);

    })

    .catch((error) => {
        if (error.isTtyError) {
            // Prompt couldn't be rendered in the current environment
            console.error(error.isTtyError);
        } else {
            // Something else went wrong
            console.log('Something went wrong')
        }
    });

