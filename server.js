const mysql = require('mysql2')
const express = require('express');

const PORT = process.env.PORT || 3001;
const app = express();

// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

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

app.get('/', (req, res) => {
    res.json({
      message: 'Hello World'
    });
  });

// Default response for any other request (Not Found)
app.use((req, res) => {
    res.status(404).end();
  });

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });