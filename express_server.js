const express = require("express");
const app = express();
const PORT = 8080; // default port 8080
const { generateRandomString } = require("./generateRandomString");
app.use(express.urlencoded({ extended: true }));

app.set("view engine", "ejs")

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
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
  const templateVars = { urls: urlDatabase };
  res.render("urls_index", templateVars);
});

//Page with website URL submission to be shortened
app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

 //Generates short URL then adds it to urlDatabase as key-value pair, along with its longURL
app.post("/urls", (req, res) => {
  console.log(req.body);
  const shortURL = generateRandomString();
  const longURL = req.body["longURL"];
  urlDatabase[shortURL] = longURL;
  res.redirect(`/urls/${shortURL}`);
});


app.get("/urls/:id", (req, res) => { 
  const templateVars = { id: req.params.id, longURL: urlDatabase[req.params.id] };
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



