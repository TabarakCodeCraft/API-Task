const express = require("express");
const app = express();
const port = 3000;
const fs = require("fs");
const { request } = require("http");

app.use(express.json());

const data = fs.readFileSync("./users.json", "utf-8");
const users = JSON.parse(data);

app.get("/", (request, response) => {
  response.send("Welcome to the main page!");
});

// 1-Get All users
app.get("/users", (request, response) => {
  response.send(users);
});

// 2-Get First users
app.get("/firstUser", (request, response) => {
  response.send(users[0]);
});

//3-Get Last users
app.get("/lastUser", (request, response) => {
  response.send(users[users.length - 1]);
});

// 4-Get user by ID
app.get("/users/:id", (request, response) => {
  let id = request.params.id;
  let user = users.find((user) => user.id == id);
  response.send(user);
});


// 5. Get user by company name
app.get("/userbycompany/:companyName", (request, response) => {
  let companyName = request.params.companyName;
  let user = users.find((el) => el.company && el.company.name === companyName);
  response.send(user);
});

// 6-Get street by ID
app.get("/street/:userId", (request, response) => {
  let userId = request.params.userId;
  let user = users.find((el) => el.id === parseInt(userId));

  if (user) {
    let street = user.address.street;
    response.send(street);
  } else {
    response.status(404).send({ success: false, message: "User not found for the specified ID" });
  }
});

// 7-Get user by City
app.get("/userbycity/:city", (request, response) => {
  let city = request.params.city;
  let usersInCity = users.filter((user) => user.address && user.address.city === city);

  response.send(usersInCity);
});

// // 8. Add new user
app.post("/adduser",(request, response)=>{
  let newUser=request.body;
  users.push(newUser);

  fs.writeFileSync("./users.json",JSON.stringify(users));
  response.send({success:true});
});

// 9. Update user
app.put("/updateuser/:id", (req, res) => {
  let id = req.params.id;
  let updatedUser = req.body;

  // Find the index of the user with the specified ID
  let userIndex = users.findIndex((el) => el.id === parseInt(id));

  // If the user exists, update their information
  if (userIndex !== -1) {
    users[userIndex] = { ...users[userIndex], ...updatedUser };

    // Save the updated users array to the JSON file
    fs.writeFileSync("./users.json", JSON.stringify(users));
    res.send({ success: true });
  } else {
    res.status(404).send({ success: false, message: "User not found" });
  }
});

// 10. Delete user
app.delete("/deleteuser/:id", (req, res) => {
  let id = req.params.id;

  // Find the index of the user with the specified ID
  let userIndex = users.findIndex((el) => el.id === parseInt(id));

  // If the user exists, remove them from the array
  if (userIndex !== -1) {
    users.splice(userIndex, 1);

    // Save the updated users array to the JSON file
    fs.writeFileSync("./users.json", JSON.stringify(users));
    res.send({ success: true });
  } else {
    res.status(404).send({ success: false, message: "User not found" });
  }
});







app.listen(port, () => {
  console.log("app listening on port 3000")
})