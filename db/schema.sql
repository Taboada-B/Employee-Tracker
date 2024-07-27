-- Drop the database if it exists
DROP DATABASE IF EXISTS tracker;

-- Create a new database
CREATE DATABASE tracker;

-- Connect to the new database
\c tracker;

-- Create department table
CREATE TABLE department (
    id SERIAL PRIMARY KEY,
    name VARCHAR(30) UNIQUE NOT NULL -- to hold department name
);

-- Create role table
CREATE TABLE role(
    id SERIAL PRIMARY KEY,
    title VARCHAR(30) UNIQUE NOT NULL, -- to hold role title
    salary DECIMAL NOT NULL, -- to hold role salary
    department_id INTEGER NOT NULL REFERENCES department(id) -- to hold reference to department role belongs to
);

-- Create employee table
CREATE TABLE employee(
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(30) NOT NULL, -- to hold employee first name
    last_name VARCHAR(30) NOT NULL, -- to hold employee last name
    role_id INTEGER NOT NULL REFERENCES role(id), -- to hold reference to employee role
    manager_id INTEGER REFERENCES employee(id) -- to hold reference to another employee that is the manager of the current employee (null if the employee has no manager)
);






-- DROP DATABASE IF EXISTS tracker;
-- CREATE DATABASE tracker;
-- \c tracker;

-- CREATE TABLE department (
--     id SERIAL PRIMARY KEY,
--     name VARCHAR(30) UNIQUE NOT NULL,
--     --to hold department name
-- ), 
-- CREATE TABLE role(
--     id SERIAL PRIMARY KEY,
--     title VARCHAR(30) UNIQUE NOT NULL,
--     --to hold role title
--     salary DECIMAL NOT NULL,
--     -- to hold role salary
--     department_id INTEGER NOT NULL REFERENCES department(id),
--     -- to hold reference to department role belongs to
-- ),
-- CREATE TABLE employee(
--     id SERIAL PRIMARY KEY,
--     first_name VARCHAR(30) NOT NULL,
--     -- to hold employee first name
--     last_name VARCHAR(30) NOT NULL,
--     -- to hold employee last name
--     role_id INTEGER NOT NULL REFERENCES role(id),
--     -- to hold reference to employee role
--     manager_id INTEGER REFERENCES employee(id),
--     -- to hold reference to another employee that is the manager of the current employee (null if the employee has no manager)
-- );