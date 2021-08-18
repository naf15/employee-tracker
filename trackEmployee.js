require('dotenv').config();
const inquirer = require('inquirer');
const mysql = require('mysql');
const cTable = require('console.table');

const connection = mysql.createConnection({
    host: "localhost", //process.env.DB_HOST,
    port: 3306,
    user: "root",//process.env.DB_USER,
    password: "password", //process.env.DB_PASSWORD,
    database: "officeDB" //process.env.DB_NAME
});


let managersList = [];
const rolesList = [];

// View all employees *
// View all roles *
// View all departments * 

// Add departments ??
// Add roles  ??
// Add employees ??

// Update employee roles -> drop down roles
// Update employee manager -> drop down managers

const getEmployees = () => {
    connection.query('SELECT id, first_name AS "First Name", last_name AS "Last Name" FROM employee', (err, res) => {
        if (err) throw err;
        console.table(res)

        managersList = res.map(({id, last_name, first_name}) => [id, last_name, first_name]);
        console.table(managersList)
    });
};

const viewItems = (table) => {
    connection.query('SELECT * FROM ??',[table], (err, res) => {
        if (err) throw err;
        console.table(res)
    })
}

const userActionChoices = [
    'Add Department',
    'Add Role',
    'Add Employee',
    'Update Employee Role',
    'Update Employee Manager', 
    'View All Departments',
    'View All Roles',
    'View All Employees',
    'Exit'
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
        name: 'name',
        type: 'input',
        message: 'What is the department name?'
    },
];

const roleInfoQuestions = [
    {
        name: 'title',
        type: 'input',
        message: 'What is the title of the role?'
    },
    {
        name: 'salary',
        type: 'input',
        message: 'What is the salary?'
    },
    {
        name: 'department',
        type: 'input',
        message: 'What is the department?'
    },
];

const employeeInfoQuestions = [
    {
        name: 'firstName',
        type: 'input',
        message: 'What is the first name?'
    },
    {
        name: 'lastName',
        type: 'input',
        message: 'What is the last name?'
    },
    {
        name: 'role',
        type: 'list',
        message: 'What is the role?',
        choices: rolesList

    },
    {
        name: 'manager',
        type: 'list',
        message: 'Who is the manager?', 
        choices: managersList
    },
];

const add = async (questions) => {
    return
    
};

const viewAllEmployees = async () => {
    return
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
            viewItems('department')
            break;
        case 'View All Roles':
            viewItems('role');
            break;
        case 'View All Employees':
            console.log('View all employees')
            // getEmployees();
            viewItems('employee');
            break;
        case 'Exit':
            connection.end();
    };
};

connection.connect((err) => {
    if (err) throw err;
    console.log('Connection Succesful....\n')
    init();
})