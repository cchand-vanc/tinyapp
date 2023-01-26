const express = require("express");
const cookieParser = require('cookie-parser')
const app = express();
const PORT = 8080; // default port 8080
const { generateRandomString } = require("./generateRandomString");

//Configuration for res.render
app.set("view engine", "ejs")

//Middleware
app.use(express.urlencoded({ extended: true }));//populates req.body
app.use(cookieParser()); //populates req.cookies

//Storage variables
const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

const users = {
  userRandomID: {
    id: "userRandomID",
    email: "b@b",
    password: "n",
  },
  user2RandomID: {
    id: "user2RandomID",
    email: "c@c",
    password: "v",
  },
};

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

app.get("/", (req, res) => {
  res.send("Hello!");
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

app.get("/urls", (req, res) => {
  const user_id = req.cookies.user_id;
  const templateVars = { urls: urlDatabase, user: users[user_id] };
  res.render("urls_index", templateVars);
});

//Page with website URL submission to be shortened
app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

 //Generates short URL then adds it to urlDatabase as key-value pair, along with its longURL
app.post("/urls", (req, res) => {
  const shortURL = generateRandomString(6);
  const longURL = req.body["longURL"];
  urlDatabase[shortURL] = longURL;
  res.redirect(`/urls/${shortURL}`);
});


app.get("/urls/:id", (req, res) => { 
  const user_id = req.cookies.user_id;
  const templateVars = { id: req.params.id, longURL: urlDatabase[req.params.id], user: users[user_id] };
  res.render("urls_show", templateVars);
});

//Fetches longURL from urlDatabase, and redirects user to that site
app.get("/u/:id", (req, res) => { 
  const longURL = urlDatabase[req.params.id];
  res.redirect(longURL);
});

//Deletes URL entry in our table
app.post("/urls/:id/delete", (req, res) => {
  delete urlDatabase[req.params.id];
  res.redirect("/urls");
});

//Updates the short URL with a new website link
app.post("/urls/:id", (req, res) => {
  urlDatabase[req.params.id] = req.body.longURL
  res.redirect("/urls");
});

//Set login cookie 
app.post("/login", (req, res) => {
  res.cookie("user_id", users[user_id].id);
  res.redirect("/urls");
});

//Clear cookie on log out
app.post("/logout", (req, res) => {
  res.clearCookie("user_id");
  res.redirect("/urls")
});

//GET registration
app.get("/register", (req, res) => {
  res.render("urls_register");
});

//POST registration
app.post("/register", (req, res) => {
  let user_id = generateRandomString(3);
  users[user_id] = { 
    id: user_id, 
    email: req.body.email,
    password: req.body.password
  }
  res.cookie("user_id", users[user_id].id);
  res.redirect("/urls");
});