const express = require("express");
const path = require("path");
const app = express();
const hbs = require("hbs");
require("./db/conn");

const Register = require("./models/registers");

const port = process.env.PORT || 5000;

const static_path = path.join(__dirname, "../public");
const template_path = path.join(__dirname, "../templates/views");
const partial_path = path.join(__dirname, "../templates/partials");

// console.log(path.join(__dirname, "../public"));

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(static_path));
app.set("view engine", "hbs");
app.set("views", template_path);
hbs.registerPartials(partial_path);

app.get("/", (req, res) => {
  res.render("index");
});

app.get("/register", (req, res) => {
  res.render("register");
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.post("/register", async (req, res) => {
  try {
    // console.log(req.body.firstname);
    // res.send(req.body.firstname);

    const password = req.body.password;
    const cpassword = req.body.confirmpassword;

    if (password === cpassword) {
      const registerEmployee = new Register({
        firstname: req.body.firstname,
        lastname: req.body.lastname,
        email: req.body.email,
        gender: req.body.gender,
        phone: req.body.phone,
        age: req.body.age,
        password: password,
        confirmpassword: cpassword,
      });

      const registered = await registerEmployee.save();
      res.status(201).render("index");
    } else {
      req.send("Password are not matching.");
    }
  } catch (e) {
    res.status(400).send(e);
  }
});

app.post("/login", async (req, res) => {
  try {
    const email = req.body.email;
    const password = req.body.password;

    const useremail = await Register.findOne({ email: email });

    if (useremail.password === password) {
      res.status(201).render("index");
    } else {
      res.send("Invalid Login Details");
    }

    // res.send(useremail.password);
    // console.log(useremail);

    // console.log(`${email} and password is ${password}`);
  } catch {
    res.status(400).send("Invalid Login Details");
  }
});

const bcrypt = require("bcryptjs");

const securePassword = async (password) => {
  const passwordHash = await bcrypt.hash(password, 10);
  console.log(passwordHash);

  const passwordmatch = await bcrypt.compare("fahad@123", passwordHash);
  console.log(passwordmatch);
};

securePassword("fahad@123");

app.listen(port, () => {
  console.log(`server is running at port no. ${port}`);
});
