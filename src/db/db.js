// src/db/index.js
const mysql = require("mysql");
const dotenv = require("dotenv");

dotenv.config();

// Configure MySQL connection
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// Connect to MySQL
db.connect((err) => {
  if (err) {
    console.error("Error connecting to MySQL: " + err.stack);
    return;
  }
  console.log("Connected to MySQL as id " + db.threadId);

  // Create 'users' table
  const createTableQuery = `
  create TABLE IF NOT EXISTS register (
    id INT AUTO_INCREMENT PRIMARY KEY,
    Username NVARCHAR(200),
    E_mail_Address NVARCHAR(200),
    Name_of_Member VARCHAR(200),
    Member_Photo NVARCHAR(800),
    Spouse_Name VARCHAR(200),
    Membership_No INT,
    Mobile_No INT(10),
    Date_of_Birth DATE,
    Spouse_Mobile INT(10),
    Spouse_Email NVARCHAR(200),
    Spouse_Date_of_Birth DATE,
    Date_of_Anniversary DATE,
    Residence_Address NVARCHAR(300),
    Business_Category VARCHAR(200),
    Business_Name NVARCHAR(250),
    Business_Logo NVARCHAR(800),
    Business_Address VARCHAR(300),
    Interest_Hobbies VARCHAR(200),
    Password NVARCHAR(16),
    Confirm_your_Password NVARCHAR(16),
    token NVARCHAR(300)
  );
  
  `;

  db.query(createTableQuery, (err) => {
    if (err) {
      console.error("Error creating table: " + err.stack);
      return;
    }
    console.log("Table created successfully");
  });
});

module.exports = db;
