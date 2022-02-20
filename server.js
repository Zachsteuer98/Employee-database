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

            //Add Department
            case "Add Department":
              addDepartment();
              break;

            //Add Role
            case "Add Role":
              addRole();
              break;

            //Add Employee
            case "Add Employee":
              addEmployee();
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

//View ALL Roles (need to connect departments to each role using primary and foreign keys)
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

//View All Employees (need to connect Roles and Manager ID using primary and foreign keys)
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

// ADD DEPARTMENT
function addDepartment() { 

  inquirer.prompt([
      {
        name: "name",
        type: "input",
        message: "What Department would you like to add?"
      }

  ])
    .then(function(choices) {
        db.query("INSERT INTO department SET ? ",
            {
              name: choices.name,
            },
            function(err, res) {
                if (err) throw err
                console.table(res);
                runEmployeeDB();
          }
      )
  })
}

// Select a Department Function
var deptArr = [];
function selectDepartment() {
  db.query("SELECT * FROM department", function(err, res) {
    if (err) throw err
    for (var i = 0; i < res.length; i++) {
      deptArr.push(res[i].name);
    }
})
return deptArr;
}

// ADD ROLE
function addRole() { 

    inquirer.prompt([
        {
          name: "title",
          type: "input",
          message: "What is the name of the new role?"
        },
        {
          name: "salary",
          type: "input",
          message: "What is the salary for the position?"
        } ,
        {
          name: "department",
          type: "rawlist",
          message: "What department does this role fall under?",
          choices: selectDepartment()
        }
    ]).then(function(choices) {
        db.query(
            "INSERT INTO role SET ?",
            {
              title: choices.title,
              salary: choices.salary,
              department_id: choices.department_id
            },
            function(err) {
                if (err) throw err
                console.table(choices);
                runEmployeeDB();
            }
        )     
    });
  }

  let roleArr = [];                                            
  function selectRole() {
    db.query("SELECT * FROM role", function(err, res) {
      if (err) throw err
      for (var i = 0; i < res.length; i++) {
        roleArr.push(res[i].title);
      }
    })
    return roleArr;
  }

// Select a Manager Function
let managersArr = [];
function selectManager() {
  db.query("SELECT first_name, last_name FROM employee", function(err, res) {
    if (err) throw err
    for (var i = 0; i < res.length; i++) {
      managersArr.push(res[i].firstName);
    }
  })
  return managersArr;
}

// ADD New Employee error (val.type === 'seperator')
function addEmployee() { 
  inquirer.prompt([
      {
        name: "first_name",
        type: "input",
        message: "First Name: "
      },
      {
        name: "last_name",
        type: "input",
        message: "Last Name: "
      },
      {
        name: "role",
        type: "list",
        message: "What is the new employee's title? ",
        choices: selectRole()
      },
      {
          name: "manager_id",
          type: "rawlist",
          message: "Who is managing the new employee? ",
          choices: selectManager()
      }

  ]).then(function (choices) {
    db.query("INSERT INTO employee SET ?", 
    {
        first_name: choices.first_name,
        last_name: choices.last_name,
        role_id: choices.role_id,
        manager_id: choices.manager_id
        
    }, 
    function(err){
        if (err) throw err
        console.table(choices)
        runEmployeeDB()
    })
  })
}

