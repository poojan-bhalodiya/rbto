// app.js
const express = require("express");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 8000;
const authRoutes = require("./routes/authroutes.js");
const authorizationMiddleware = require("./middleware/authorization.js"); // Import the authorization middleware

app.use(bodyParser.json());
dotenv.config();
app.use(cors());
app.use(authorizationMiddleware);
1;
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/auth", authRoutes);
app.get("/hello", (req, res) => {
  res.send("Hello World");
});
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
