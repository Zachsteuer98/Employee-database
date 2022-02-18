const mysql = require('mysql2')
const inqurier = require('inquirer')
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

db.query('SELECT * FROM department', (err, rows) => {
    console.log(rows);
})

