const db = require("../db/db");
const jwt = require("jsonwebtoken");
const { isValidEmail, isValidPassword } = require("../utils/validation.js");

const validateRequiredFields = (fields) => {
  for (const field of fields) {
    if (!field || field.trim() === "") {
      return false;
    }
  }
  return true;
};

const createUserQuery = `
INSERT INTO pooja (
  id, username, email, visible_email, member_name, profile_pic,
  membership_no, mobile_number, date_of_birth, spouse_name,
  spouse_mobile_no, spouse_email, spouse_dob, date_of_anniversary,
  residence_address, business_category, business_name, business_logo,
  business_address, interest_hobbies, password, password_confirmation
) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`;

const checkEmailQuery = "SELECT * FROM pooja WHERE email = ?";

exports.createUser = (req, res) => {
  const requiredFields = [
    req.body.username,
    req.body.email,
    req.body.member_name,
    req.body.password,
  ];

  if (!validateRequiredFields(requiredFields)) {
    return res.status(400).json({
      statusCode: 1,
      response: {
        status: false,
        message: "Required fields are missing or empty",
      },
    });
  }

  if (req.body.password !== req.body["password_confirmation"]) {
    return res.status(400).json({
      statusCode: 1,
      response: {
        status: false,
        message: "Password and Confirm Password do not match",
      },
    });
  }

  if (!isValidEmail(req.body.email)) {
    return res.status(400).json({
      statusCode: 1,
      response: {
        status: false,
        message: "Invalid email address",
      },
    });
  }

  if (!isValidPassword(req.body.password)) {
    return res.status(400).json({
      statusCode: 1,
      response: {
        status: false,
        message:
          "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character",
      },
    });
  }

  const {
    id,
    username,
    email,
    visible_email,
    member_name,
    profile_pic,
    membership_no,
    mobile_number,
    date_of_birth,
    spouse_name,
    spouse_mobile_no,
    spouse_email,
    spouse_dob,
    date_of_anniversary,
    residence_address,
    business_category,
    business_name,
    business_logo,
    business_address,
    interest_hobbies,
    password,
    password_confirmation,
  } = req.body;

  db.query(checkEmailQuery, [email], (emailErr, emailResult) => {
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

    const values = [
      id,
      username,
      email,
      visible_email,
      member_name,
      profile_pic,
      membership_no,
      mobile_number,
      date_of_birth,
      spouse_name,
      spouse_mobile_no,
      spouse_email,
      spouse_dob,
      date_of_anniversary,
      residence_address,
      business_category,
      business_name,
      business_logo,
      business_address,
      interest_hobbies,
      password,
      password_confirmation,
    ];

    db.query(createUserQuery, values, (err, result) => {
      if (err) {
        console.error("Error creating user: " + err.stack);
        return res.status(500).send("Internal Server Error");
      }

      try {
        const token = jwt.sign(
          { user_id: id, email },
          process.env.JWT_SECRET || "fallback_secret",
          { expiresIn: "24h" }
        );

        if (result && result.affectedRows > 0) {
          res.set("Authorization", `Bearer ${token}`);
          res.status(200).json({
            statusCode: 1,
            response: {
              status: true,
              message: "User is registered",
              user: { id, email, token },
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
  });
};
