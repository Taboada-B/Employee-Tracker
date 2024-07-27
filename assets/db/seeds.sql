-- Connect to the tracker database
\c tracker;

-- Insert seed data into department table
INSERT INTO department (name) VALUES
('Engineering'),
('Human Resources'),
('Finance'),
('Sales');

-- Insert seed data into role table
INSERT INTO role (title, salary, department_id) VALUES
('Software Engineer', 80000, 1),
('HR Manager', 75000, 2),
('Accountant', 70000, 3),
('Sales Representative', 60000, 4);

-- Insert seed data into employee table
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES
('John', 'Doe', 1, NULL), -- Software Engineer without manager
('Jane', 'Smith', 2, NULL), -- HR Manager without manager
('Jim', 'Brown', 3, NULL), -- Accountant without manager
('Jake', 'White', 4, NULL), -- Sales Representative without manager
('Sarah', 'Connor', 1, 1), -- Software Engineer managed by John Doe
('Linda', 'Hamilton', 4, 4); -- Sales Representative managed by Jake White