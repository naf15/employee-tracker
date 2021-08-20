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

const getDepartments = (func) => {
    connection.query('SELECT id, name FROM department', async (err, res) => {
        if (err) throw err;

        departmentsList = await res.map(({ name }) => name );

        getRoles(func);
    });
};

const getRoles = (func) => {
    connection.query('SELECT title FROM role', async (err, res) => {
        if (err) throw err;
        rolesList = await res.map(({ title }) => title);

        getEmployees(func)
    });
};

const getEmployees = (func) => {
    connection.query('SELECT id, first_name, last_name FROM employee', async (err, res) => {
        if (err) throw err;

        managersList = await res.map(({ id, last_name, first_name }) => `${first_name} ${last_name} (ID# ${id})`);
        
        func();
    });
};


const viewAllItems = (table) => {
    connection.query('SELECT * FROM ??', [table], (err, res) => {
        if (err) throw err;
        console.table(res);
        init();
    });
};

const addDepartment = async () => {
    const { name } = await inquirer.prompt(departmentInfoQuestions);

    if( departmentsList.indexOf(name) >= 0 ){
        console.log('Department already exists!\n');
    } else {
        connection.query(`INSERT INTO department SET ?`, {name: name}, (err, res) => {
            if (err) throw err;
            console.log('Department added!\n');
            init();
        })
    }
};

const addEmployee = async () => {
    if(rolesList) {
        const { firstName, lastName, role, manager } = await inquirer.prompt([
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
        ])
              
        const managerStringLength = manager.length; 
        const managerId = parseInt(manager.slice(manager.indexOf('ID# ') + 4 ,managerStringLength-1));
        console.log(role)

        connection.query(`SELECT id FROM role WHERE ?`,{title: role}, (err, res) => {
            if (err) throw err;
            const [ roleId ] = res.map(({id}) => id);

            connection.query(`INSERT INTO employee SET ?`, 
            {
                first_name: firstName, 
                last_name: lastName, 
                role_id: roleId, 
                manager_id: managerId
            }, 
            (err, res) => {
                if (err) throw err;
                console.log('Employee added!\n');
                init();
            });
        });
    };
};
        

const add = async (questions) => {
    return
    
};

const init = async () => {
    const {userAction} = await inquirer.prompt(startupQuestions);


    switch(userAction) {
        case 'Add Department':
            getDepartments(addDepartment);
            break;
        case 'Add Role':
            getDepartments(addRole);
            break;
        case 'Add Employee':
            getDepartments(addEmployee);
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
        case '':
            init();
    };
     
};

connection.connect((err) => {
    if (err) throw err;
    console.log('Connection Succesful....\n')
    init();
});