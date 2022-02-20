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

            //Update Employee Role
            case "Update an Employee Role":
              updateEmployeeRole();
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

  db.query("SELECT role.id AS id, role.title AS title, role.salary AS salary, department.name AS department FROM role LEFT JOIN department ON department_id = department.id",
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

  db.query("SELECT employee.id AS id, employee.first_name AS first_name, employee.last_name AS last_name, role.title, manager.first_name AS manager FROM employee LEFT JOIN role ON employee.role_id = role.id LEFT JOIN employee manager ON manager.id = employee.manager_id",
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
        roleArr.push
        ({
          name: res[i].title,
          value: res[i].id
        });
      }
    })
    return roleArr;
  }

// Select a Manager Function
let managersArr = [];
function selectManager() {
  managersArr= []
  db.query("SELECT * FROM employee", function(err, res) {
    if (err) throw err
    for (var i = 0; i < res.length; i++) {

      managersArr.push
      ({
        name: res[i].first_name + "  " + res[i].last_name, 
        value: res[i].id
      });
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
          type: "list",
          message: "Who is managing the new employee? ",
          choices: selectManager()
      }

  ]).then(function (choices) {
    db.query("INSERT INTO employee SET ?", 
    {
        first_name: choices.first_name,
        last_name: choices.last_name,
        role_id: choices.role,
        manager_id: choices.manager_id
        
    }, 
    function(err){
        if (err) throw err
        console.table(choices)
        runEmployeeDB()
    })
  })
}

// Select role 
let roleArray = [];                                            
function selectRole() {
  db.query("SELECT * FROM role", function(err, res) {
    if (err) throw err
    for (var i = 0; i < res.length; i++) {
      roleArray.push
      ({
        name: res[i].title,
        value: res[i].id
      });
    }
  })
  return roleArray;
}

// Update employee role 
function updateEmployeeRole() {
  db.query("SELECT * FROM employee", function(err, res) {
    if (err) throw err
    var employeeChoices = []
    for (var i = 0; i < res.length; i++) {

      employeeChoices.push
      ({
        name: res[i].first_name + "  " + res[i].last_name, 
        value: res[i].id
      });
    }
 
          inquirer.prompt([
              {
                  name: "id",
                  type: "list",
                  message: "What employee would you like to update?",
                  choices: employeeChoices
              },
              {
                  name: "role_id",
                  type: "rawlist",
                  message: "What is the employee's new title? ",
                  choices: selectRole()
              },
          ]).then(function (choices) {
              
              db.query("UPDATE employee SET role_id = ? WHERE id = ?",
                  [choices.role_id, choices.id],
      
                  function (err) {
                      if (err)
                          throw err;
                      console.table(choices);
                      runEmployeeDB();
          });
    });
  })
}
