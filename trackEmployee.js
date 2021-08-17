require('dotenv').config();
const inquirer = require('inquirer');
const mysql = require('mysql');

const connection = mysql.createConnection({
    host: process.env.DB_HOST,
    port: 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

// View all employees *
// View all roles *
// View all departments * 

// Add departments ??
// Add roles  ??
// Add employees ??

// Update employee roles -> drop down roles
// Update employee manager -> drop down managers

const userActionChoices = [
    'Add Department',
    'Add Role',
    'Add Employee',
    'Update Employee Role',
    'Update Employee Manager', 
    'View All Departments',
    'View All Roles',
    'View All Employees'
]

const startupQuestions = [
    {
        name: 'userAction',
        type: 'list',
        message: 'What would you like to do?',
        choices: userActionChoices
    },
]

const departmentInfoQuestions = [
    {

    }
];

const roleInfoQuestions = [
    {

    }
];

const employeeInfoQuestions = [
    {
        name: ''
    }
];

const add = async (questions) => {

};

const view = async () => {

};

const init = async () => {
    const {userAction} = await inquirer.prompt(startupQuestions);

    switch(userAction) {
        case 'Add Department':
            add(departmentInfoQuestions);
            break;
        case 'Add Role':
            add(roleInfoQuestions);
            break;
        case 'Add Employee':
            add(employeeInfoQuestions);
            break;
        case 'View All Departments':
            break;
        case 'View All Roles':
            break;
        case 'View Add Employees':
            break;
    }

};

connection.connect((err) => {
    if (err) throw err;
    init();
})