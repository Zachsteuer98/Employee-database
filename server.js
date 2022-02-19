const mysql = require('mysql2')
const inquirer = require('inquirer')
const cTable = require('console.table')

require('dotenv').config();

// Connect to database
const db = mysql.createConnection(
    {
      host: 'localhost',
      // Your MySQL username,
      user: process.env.DB_USER,
      // Your MySQL password
      password: process.env.DB_PW,
      database: process.env.DB_NAME
    },
    console.log('Connected to the employee database.')
  );

  db.connect(function(err) {
    if (err) throw err;
   
    console.log ("======================================");
    console.log ("");
    console.log ("   WELCOME TO THE EMPLOYEE DATABASE   ");
    console.log ("");
    console.log ("======================================");
    runEmployeeDB();
  });


// LIST OF CHOICES FOR USER ___________________________

function runEmployeeDB() {
    inquirer.prompt([
    {
    type: "list",
    message: "What would you like to do?",
    name: "action",
    choices: [
            "View All Departments", 
            "View All Roles",
            "View All Employees",
            "Add Department",
            "Add Role",
            "Add Employee",
            "Update an Employee Role",
            "Exit"
            ]
    }
]).then(function(choices) {
        switch (choices.action) {

            //View All Departments
            case "View All Departments":
              viewAllDepartments();
            break;

            //View All Roles
            case "View All Roles":
              viewAllRoles();
              break;

            //View All Employees
            case "View All Employees":
              viewAllEmployees();
              break;

            //EXIT
            case "Exit":
                console.log ("===============================================");
                console.log ("");
                console.log ("   THANK YOU FOR USING THE EMPLOYEE DATABASE   ");
                console.log ("");
                console.log ("===============================================");
                db.end();
            break;
            }
    })
};

//View All Departments
function viewAllDepartments() {

  db.query("SELECT department.id AS id, department.name AS name FROM department",
  function(err, res) {
    if (err) throw err
    console.log("------------------------")
    console.log(" === DEPARTMENT LIST ===")
    console.log("------------------------")
    console.table(res)
    runEmployeeDB()
  })
}

//View ALL Roles
function viewAllRoles() {

  db.query("SELECT role.id AS id, role.title AS title, role.salary AS salary FROM role",
  function(err, res) {
    if (err) throw err
    console.log("------------------------")
    console.log(" === ROLE LIST ===")
    console.log("------------------------")
    console.table(res)
    runEmployeeDB()
  })
}

function viewAllEmployees() {

  db.query("SELECT employee.id AS id, employee.first_name AS first_name, employee.last_name AS last_name, employee.role_id AS role_id, employee.manager_id AS manager_id FROM employee",
  function(err, res) {
    if (err) throw err
    console.log("------------------------")
    console.log(" === EMPLOYEE LIST ===")
    console.log("------------------------")
    console.table(res)
    runEmployeeDB()
  })
}



