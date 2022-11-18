const express = require("express");
const bodyParser = require("body-parser");
const urlencodedParser = bodyParser.urlencoded({ extended: false });

const app = express();
const PORT = process.env.PORT || 8002;

const usersData = require("./users-mock-data.json") || [];
const users = [...usersData];

app.get("/users", (req, res) => {
  res.status(200).json(users || []);
});

app.get('/user/:userId', (req, res) => {

    if(!req.params.userId) {
        res.status(400).send('Error: Please add a userId to fetch details');
    }

    const user = users.find(p => p.id == req.params.userId);

    if (user) {
        res.status(200).json(user);
    } else {
        res.status(401).send(`Error: No user found with id - ${req.params.userId}`);
    }
});

app.post("/login", urlencodedParser, (req, res) => {
  console.log("req.body", req.body.username);
  const userName = req.body.username;
  const password = req.body.password;

  if (!userName || !password) {
    res.status(400).send("Error: Please enter username and password to login");
  }

  const userFound = users.find(
    (u) => u.username === userName && u.password === password
  );
  if (userFound) {
    delete userFound.password;
    res.status(200).json({
      status: "Login Successful",
      data: userFound,
    });
  } else {
    res.status(401).send(`Error: Credentials don't match`);
  }
});

app.post("/register", urlencodedParser, (req, res) => {
  const userName = req.body.username;
  const password = req.body.password;
  const email = req.body.email;
  const firstname = req.body.firstname;
  const lastname = req.body.lastname;
  const phone = req.body.phone;
  const id = req.body.id;

  console.log('req.body', req.body);
  console.log('users', users);
  if (
    !userName ||
    !password ||
    !email ||
    !firstname ||
    !lastname ||
    !phone ||
    !id
  ) {
    res.status(400).send("Error: Please send all required fields for login");
    return;
  } else {

    const userAlreadyExists = users.find(u => u.id == req.body.id);
    if (userAlreadyExists) {
        res.status(400).send("Error; User already exists with same id");
        return
    }

    const newUser = {
        username: userName,
        password,
        email,
        name: { firstname, lastname },
        phone,
        id: +id,
        address: {
          geolocation: { lat: "", long: "" },
          city: "Dummy New",
          street: "Dummy St",
          number: 00,
          zipcode: "00000-0000",
        },
      };
    
      users.push(newUser);
    
      res.status(201).json({
        status: "User Created successful, please login to continue",
        data: newUser,
      });
      console.log('users', users);
  }
});

app.use("/", (req, res) => {
  res.send("Hello from the user service");
});

app.listen(PORT, () => {
  console.log(`User Service listening on port ${PORT}`);
});
