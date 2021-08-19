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

let managersList; 
let rolesList; 
let departmentsList;

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
];

const startupQuestions = [
    {
        name: 'userAction',
        type: 'list',
        message: 'What would you like to do?',
        choices: userActionChoices
    },
];

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

const getDepartments = () => {
    connection.query('SELECT id, name AS "Name" FROM department', (err, res) => {
        if (err) throw err;

        departmentsList = res.map(({ id, name }) => [id, name]);
    });
};

const getRoles = () => {
    connection.query('SELECT title FROM role', async (err, res) => {
        if (err) throw err;
        rolesList = await res.map(({ title }) => [title]);
        if(rolesList) console.log(rolesList);
    });
};

const getEmployees = () => {
    connection.query('SELECT id, first_name, last_name FROM employee', async (err, res) => {
        if (err) throw err;

        managersList = await res.map(({ id, last_name, first_name }) => `${first_name} ${last_name} (ID# ${id})`);
        console.log(managersList);
        console.log("what");
    });
};


const viewAllItems = (table) => {
    connection.query('SELECT * FROM ??', [table], async (err, res) => {
        if (err) throw err;
        console.table(await res);
    });
};

const addEmpolyee = async () => {
    console.log('Add Employee\n')
    console.log(rolesList)
    if(rolesList) {
        console.log('Add Employee IN\n')
        const { firstName, lastName, role, manager } = await inquirer.prompt(employeeInfoQuestions);
        const managerStringLength = manager.managerStringLength; 
        const managerId = manager.splice(manager.find('ID# '),managerStringLength-1);
        console.log(managerId);

        // connection.query('SELECT * FROM employee WHERE?', {
        //     manager_id: firstName,
        //     last_name: lastName
        // }, 
        // (err,res) => {
        //     if(err) throw err;
        //     console.log(res);
        // })
        // connection.query('UPDATE employee ()');
    } else {
        console.log('Please enter a role first.\n');
    };
};

const add = async (questions) => {
    return
    
};

const init = async () => {
    const {userAction} = await inquirer.prompt(startupQuestions);

    // getDepartments()
    getRoles();
    // getEmployees();

    console.log("first")


    switch(userAction) {
        case 'Add Department':
            add(departmentInfoQuestions);
            break;
        case 'Add Role':
            add(roleInfoQuestions);
            break;
        case 'Add Employee':
            console.log('wasdasd')
            console.log('wasdasd')
            console.log('wasdasd')
            console.log('wasdasd')
            console.log('wasdasd')
            break;
        case 'View All Departments':
            viewAllItems('department')
            break;
        case 'View All Roles':
            viewAllItems('role');
            break;
        case 'View All Employees':
            viewAllItems('employee');
            break;
        case 'Exit':
            connection.end();
            return;
    };
    init();
};

connection.connect((err) => {
    if (err) throw err;
    console.log('Connection Succesful....\n')
    init();
});