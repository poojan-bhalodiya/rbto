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
    username NVARCHAR(200),
    e_mail_address NVARCHAR(200),
    name_of_member VARCHAR(200),
    member_photo NVARCHAR(800),
    spouse_name VARCHAR(200),
    membership_no INT,
    mobile_no INT(10),
    date_of_birth DATE,
    spouse_mobile INT(10),
    spouse_email NVARCHAR(200),
    spouse_date_of_birth DATE,
    date_of_anniversary DATE,
    residence_address NVARCHAR(300),
    business_category VARCHAR(200),
    business_name NVARCHAR(250),
    business_logo NVARCHAR(800),
    business_address VARCHAR(300),
    interest_hobbies VARCHAR(200),
    password NVARCHAR(16),
    confirm_your_password NVARCHAR(16),
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
