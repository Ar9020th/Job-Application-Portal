const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const users = require("./routes/api/users");
const applicant = require("./routes/api/applicantprofile");
const recruiter = require("./routes/api/recruiterprofile");
const passport = require("passport");
mongoose
  .connect("mongodb://localhost/test1")
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));
const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Passport middleware
app.use(passport.initialize());

//Passport Config
require("./config/passport")(passport);

app.use("/api/users", users);
app.use("/api/applicant", applicant);
app.use("/api/recruiter", recruiter);

const port = process.env.PORT || 8888;
app.listen(port, () => console.log(`Server running on port ${port}`));
