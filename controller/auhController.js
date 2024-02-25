const db = require("../db/db");
const jwt = require("jsonwebtoken");
const { isValidEmail, isValidPassword } = require("../utils/validation.js");

// Validation function for required fields
const validateRequiredFields = (fields) => {
  for (const field of fields) {
    if (!field || field.trim() === "") {
      return false;
    }
  }
  return true;
};
// Create user
exports.createUser = (req, res) => {
  // Define the required fields
  const requiredFields = [
    req.body.username,
    req.body.e_mail_address,
    req.body.name_of_member,
    req.body.password,
  ];

  // Check if required fields are present
  if (!validateRequiredFields(requiredFields)) {
    return res.status(400).json({
      statusCode: 1,
      response: {
        status: false,
        message: "Required fields are missing or empty",
      },
    });
  }

  // Check if password and confirm password match
  if (req.body.password !== req.body["confirm_your_password"]) {
    return res.status(400).json({
      statusCode: 1,
      response: {
        status: false,
        message: "Password and Confirm Password do not match",
      },
    });
  }

  // Validate email syntax
  if (!isValidEmail(req.body.e_mail_address)) {
    return res.status(400).json({
      statusCode: 1,
      response: {
        status: false,
        message: "Invalid email address",
      },
    });
  }

  // Validate password
  if (!isValidPassword(req.body.password)) {
    return res.status(400).json({
      statusCode: 1,
      response: {
        status: false,
        message:
          "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character ",
      },
    });
  }

  // Check if the email is already registered
  const checkEmailQuery = "SELECT * FROM register WHERE e_mail_address = ?";
  db.query(
    checkEmailQuery,
    [req.body.e_mail_address],
    (emailErr, emailResult) => {
      if (emailErr) {
        console.error("Error checking email: " + emailErr.stack);
        return res.status(500).send("Internal Server Error");
      }

      if (emailResult && emailResult.length > 0) {
        return res.status(400).json({
          statusCode: 1,
          response: {
            status: false,
            message: "Email address is already registered",
          },
        });
      }
      const {
        id,
        username,
        e_mail_address,
        name_of_member,
        member_photo,
        spouse_name,
        membership_no,
        mobile_no,
        date_of_birth,
        spouse_mobile,
        spouse_email,
        spouse_date_of_birth,
        date_of_anniversary,
        residence_address,
        business_category,
        business_name,
        business_logo,
        business_address,
        interest_hobbies,
        password,
        confirm_your_password,
      } = req.body;

      const createUserQuery =
        "INSERT INTO register (id,username,e_mail_address,name_of_member,member_photo,spouse_name,membership_no,mobile_no,date_of_birth,spouse_mobile,spouse_email,spouse_date_of_birth,date_of_anniversary,residence_address,business_category,business_name,business_logo,business_address,interest_hobbies,password,confirm_your_password) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

      const values = [
        id,
        username,
        e_mail_address,
        name_of_member,
        member_photo,
        spouse_name,
        membership_no,
        mobile_no,
        date_of_birth,
        spouse_mobile,
        spouse_email,
        spouse_date_of_birth,
        date_of_anniversary,
        residence_address,
        business_category,
        business_name,
        business_logo,
        business_address,
        interest_hobbies,
        password,
        confirm_your_password,
      ];

      db.query(createUserQuery, values, (err, result) => {
        if (err) {
          console.error("Error creating user: " + err.stack);
          res.status(500).send("Internal Server Error");
          return;
        }

        try {
          const token = jwt.sign(
            { user_id: id, e_mail_address },
            "UNSAFE_STRING",
            {
              expiresIn: "24h",
            }
          );

          // Check if the user was successfully created
          if (result && result.affectedRows > 0) {
            // Set the token in the response header
            res.set("Authorization", `Bearer ${token}`);
            res.status(200).json({
              statusCode: 1,
              response: {
                status: true,
                message: "User is registered",
                user: { id, e_mail_address, token }, // Adjust the response as needed
              },
            });
          } else {
            res.status(400).json({
              statusCode: 1,
              response: {
                status: false,
                message: "User creation failed",
              },
            });
          }
        } catch (err) {
          res.status(400).json({
            statusCode: 1,
            response: {
              status: false,
              message: err.message,
            },
          });
        }
      });
    }
  );
};
