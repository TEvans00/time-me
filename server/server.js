const express = require('express');
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));

app.use(express.static('../public'));

const mongoose = require('mongoose');

// connect to the database
mongoose.connect('mongodb://localhost:27017/tickets', {
  useNewUrlParser: true
});

const cookieParser = require("cookie-parser");
app.use(cookieParser());

const tickets = require("./users.js");
app.use("/api/users", tickets);
const projects = require("./projects.js");
app.use("/api/projects", projects);

app.listen(3000, () => console.log('Server listening on port 3000!'));
