// app.js
const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const app = express();
const port = process.env.PORT || 8080;
const authRoutes = require("./src/routes/authroutes.js");
const authorizationMiddleware = require("./src/middleware/authorization"); // Import the authorization middleware

app.use(bodyParser.json());
dotenv.config();
app.use(authorizationMiddleware);
1;
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/auth", authRoutes);
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
