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
    req.body.Username,
    req.body.E_mail_Address,
    req.body.Name_of_Member,
    req.body.Password,
  ];

  // Check if required fields are present
  if (!validateRequiredFields(requiredFields)) {
    return res.status(400).json({
      statusCode: 1,
      responseData: {
        status: false,
        message: "Required fields are missing or empty",
      },
    });
  }

  // Check if password and confirm password match
  if (req.body.Password !== req.body["Confirm_your_Password"]) {
    return res.status(400).json({
      statusCode: 1,
      responseData: {
        status: false,
        message: "Password and Confirm Password do not match",
      },
    });
  }

  // Validate email syntax
  if (!isValidEmail(req.body.E_mail_Address)) {
    return res.status(400).json({
      statusCode: 1,
      responseData: {
        status: false,
        message: "Invalid email address",
      },
    });
  }

  // Validate password
  if (!isValidPassword(req.body.Password)) {
    return res.status(400).json({
      statusCode: 1,
      responseData: {
        status: false,
        message:
          "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character ",
      },
    });
  }

  // Check if the email is already registered
  const checkEmailQuery = "SELECT * FROM register WHERE E_mail_Address = ?";
  db.query(
    checkEmailQuery,
    [req.body.E_mail_Address],
    (emailErr, emailResult) => {
      if (emailErr) {
        console.error("Error checking email: " + emailErr.stack);
        return res.status(500).send("Internal Server Error");
      }

      if (emailResult && emailResult.length > 0) {
        return res.status(400).json({
          statusCode: 1,
          responseData: {
            status: false,
            message: "Email address is already registered",
          },
        });
      }
      const {
        id,
        Username,
        E_mail_Address,
        Name_of_Member,
        Member_Photo,
        Spouse_Name,
        Membership_No,
        Mobile_No,
        Date_of_Birth,
        Spouse_Mobile,
        Spouse_Email,
        Spouse_Date_of_Birth,
        Date_of_Anniversary,
        Residence_Address,
        Business_Category,
        Business_Name,
        Business_Logo,
        Business_Address,
        Interest_Hobbies,
        Password,
        Confirm_your_Password,
      } = req.body;

      const createUserQuery =
        "INSERT INTO register (id, Username, E_mail_Address, Name_of_Member, Member_Photo, Spouse_Name, Membership_No, Mobile_No, Date_of_Birth, Spouse_Mobile, Spouse_Email, Spouse_Date_of_Birth, Date_of_Anniversary, Residence_Address, Business_Category, Business_Name, Business_Logo, Business_Address, Interest_Hobbies, Password, Confirm_your_Password) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

      const values = [
        id,
        Username,
        E_mail_Address,
        Name_of_Member,
        Member_Photo,
        Spouse_Name,
        Membership_No,
        Mobile_No,
        Date_of_Birth,
        Spouse_Mobile,
        Spouse_Email,
        Spouse_Date_of_Birth,
        Date_of_Anniversary,
        Residence_Address,
        Business_Category,
        Business_Name,
        Business_Logo,
        Business_Address,
        Interest_Hobbies,
        Password,
        Confirm_your_Password,
      ];

      db.query(createUserQuery, values, (err, result) => {
        if (err) {
          console.error("Error creating user: " + err.stack);
          res.status(500).send("Internal Server Error");
          return;
        }

        try {
          const token = jwt.sign(
            { user_id: id, E_mail_Address },
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
              responseData: {
                status: true,
                message: "User is registered",
                user: { id, E_mail_Address, token }, // Adjust the response as needed
              },
            });
          } else {
            res.status(400).json({
              statusCode: 1,
              responseData: {
                status: false,
                message: "User creation failed",
              },
            });
          }
        } catch (err) {
          res.status(400).json({
            statusCode: 1,
            responseData: {
              status: false,
              message: err.message,
            },
          });
        }
      });
    }
  );
};
