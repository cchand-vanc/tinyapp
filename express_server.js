const express = require("express");
const cookieParser = require('cookie-parser');
const app = express();
const PORT = 8080; // default port 8080
const { generateRandomString, getUserByEmail, urlsForUser } = require("./tinyapp_functions");

//Configuration for res.render
app.set("view engine", "ejs");

//Middleware
app.use(express.urlencoded({ extended: true }));//populates req.body
app.use(cookieParser()); //populates req.cookies

//Storage variables
const urlDatabase = {
  b2xVn2: {
    longURL: "http://www.lighthouselabs.ca",
    user_id: "b@b"
  },
  i3BoGr: {
    longURL: "http://www.google.com",
    user_id: "c@c",
  },
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
  if (!user_id) {
    res.status(401).send("Please log in to access this page")
  } else {
    const templateVars = { urls: urlDatabase, user: users[user_id] };
    res.render("urls_index", templateVars);
  }
});

//Generates short URL then adds it to urlDatabase as key-value pair, along with its longURL
app.post("/urls", (req, res) => {
  const shortURL = generateRandomString(6);
  const longURL = req.body["longURL"];
  const user_id = req.cookies.user_id;

  if (user_id) {
    urlDatabase[shortURL] = { longURL, user_id: user_id };
    res.redirect(`/urls/${shortURL}`)
  } else {
    res.status(401).send("Please log in to access this page!")
  }
});

//Page with website URL submission to be shortened
app.get("/urls/new", (req, res) => {
  const user_id = req.cookies.user_id;
  if (user_id) {
    const templateVars = { user: users[user_id] };
    res.render("urls_new", templateVars);
  } else {
    res.redirect("/login")
  }
});

app.get("/urls/:id", (req, res) => {
  const user_id = req.cookies.user_id;
  if (!user_id) {
    res.status(401).send("Please log in to access this page!")
  } else {
    const foundURLs = urlsForUser(user_id, urlDatabase);
    if (!foundURLs) {
      res.status(401).send("You do not own any these URLs - time to go make your own!");
    } else {
      const shortURL = req.params.id;
      const templateVars = { id: req.params.id, longURL: urlDatabase[shortURL].longURL, user: users[user_id] };

      res.render("urls_show", templateVars);
    }
  }
});

//Updates the short URL with a new website link
app.post("/urls/:id", (req, res) => {
  const foundURLs = urlsForUser(req.params.id, urlDatabase);
  if (!foundURLs){
    res.status(401).send("You are not permitted to access this URL!")
  } else {
  urlDatabase[req.params.id].longURL = req.body.longURL;
  res.redirect("/urls");
  }
});

//Fetches longURL from urlDatabase, and redirects user to that site
app.get("/u/:id", (req, res) => {
  let shortURL = req.params.id;
  if (!urlDatabase[shortURL]) {
    res.status(400).send("This Short URL does not exist yet. Please go to 'Create New URL' and submit your long URL for shortening!")
  } else {
    const longURL = urlDatabase[shortURL].longURL;
    res.redirect(longURL);
  }
});

//Deletes URL entry in our table
app.post("/urls/:id/delete", (req, res) => {
  const foundURLs = urlsForUser(req.params.id, urlDatabase);
  if (!foundURLs){
    res.status(401).send("You are not permitted to delete this URL!")
  } else {
    delete urlDatabase[req.params.id];
    res.redirect("/urls");
  }
});


//GET login
app.get("/login", (req, res) => {
  if (req.cookies.user_id) {
    res.redirect("/urls")
  }
  else {
    res.render("login");
  }
});

//POST login
app.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const foundUser = getUserByEmail(email, users);

  if (!foundUser) {
    return res.status(403).send("Could not find user with that email");
  }
  else if (password !== foundUser.password) {
    return res.status(403).send("Password does not match");
  }

  const user_id = foundUser.id;
  res.cookie("user_id", user_id);
  res.redirect("/urls");
});

//Clear cookie on log out
app.post("/logout", (req, res) => {
  res.clearCookie("user_id");
  res.redirect("/login");
});

//GET registration
app.get("/register", (req, res) => {
  if (req.cookies.user_id) {
    res.redirect("/urls")
  }
  else {
    res.render("register");
  }
});

//POST registration
app.post("/register", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  //If email or password field is empty
  if (!email || !password) {
    res.status(400).send("Please input an email and password");
  }

  //Adding user if they dont exist
  const foundUser = getUserByEmail(email, users);
  if (!foundUser) {
    const user_id = generateRandomString(3);
    users[user_id] = {
      id: user_id,
      email,
      password
    };
    res.cookie("user_id", user_id);
    res.redirect("/urls");
  } else {
    return res.status(400).send('Email address is already in use');
  }
});
