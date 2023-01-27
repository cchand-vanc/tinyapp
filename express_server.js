const express = require("express");
const cookieSession = require('cookie-session')
const bcrypt = require("bcryptjs")
const app = express();
const PORT = 8080; // default port 8080
const { generateRandomString, getUserByEmail, urlsForUser } = require("./tinyapp_functions");

//Configuration for res.render
app.set("view engine", "ejs");

//Middleware
app.use(express.urlencoded({ extended: true }));//populates req.body
app.use(cookieSession({
  name: 'tinycookie',
  keys: ["aazfcvt54567ujnHYduk6", "bbp234lkjn23i7cmserp2"],
  })); 

//Storage variables
const urlDatabase = {};

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
  const user_id = req.session.user_id;
  if (!user_id) {
    return res.status(401).send("Please log in to access this page")
  } 
    const templateVars = { urls: urlDatabase, user: users[user_id] };
    res.render("urls_index", templateVars);
  
});

//Generates short URL then adds it to urlDatabase as key-value pair, along with its longURL
app.post("/urls", (req, res) => {
  const shortURL = generateRandomString(6);
  const longURL = req.body["longURL"];
  const user_id = req.session.user_id;

  if (!user_id) {
    return res.status(401).send("Please log in to access this page!");
  }
    urlDatabase[shortURL] = { longURL, user_id: user_id };
    res.redirect(`/urls/${shortURL}`)
});

//Short URL creation page
app.get("/urls/new", (req, res) => {
  const user_id = req.session.user_id;
  if (user_id) {
    const templateVars = { user: users[user_id] };
    res.render("urls_new", templateVars);
  } else {
    res.redirect("/login")
  }
});

//Short URL creation page
app.get("/urls/:id", (req, res) => {
  const user_id = req.session.user_id;
  
  if (!user_id) {
    return res.status(401).send("Please log in to access this page!")
  }

  const foundURLs = urlsForUser(user_id, urlDatabase);
  if (!foundURLs) {
    return res.status(401).send("You do not own this URL - time to go make your own!");
  }

  const shortURL = req.params.id;
  const templateVars = { id: req.params.id, longURL: urlDatabase[shortURL].longURL, user: users[user_id] };

  res.render("urls_show", templateVars);
});

//Updates the short URL with a new website link
app.post("/urls/:id", (req, res) => {
  const foundURLs = urlsForUser(req.params.id, urlDatabase);
  if (!foundURLs){
    console.log(urlDatabase)
    return res.status(401).send("You are not permitted to access this URL!")
  } 
  urlDatabase[req.params.id].longURL = req.body.longURL;
  res.redirect("/urls");
});

//Fetches longURL from urlDatabase, and redirects user to that site
app.get("/u/:id", (req, res) => {
  let shortURL = req.params.id;
  if (!urlDatabase[shortURL]) {
    return res.status(400).send("This Short URL does not exist yet. Please go to 'Create New URL' and submit your long URL for shortening!")
  } 

  const longURL = urlDatabase[shortURL].longURL;
  res.redirect(longURL);
});

/////////Delete URL Entry 
app.post("/urls/:id/delete", (req, res) => {
  // Are they logged in
  const user_id = req.session.user_id;
  if (!user_id) {
    return res.status(403).send("You are not logged in!")
  }

  // Is URL in urlDatabase
  const urlObject = urlDatabase[req.params.id]
  if (!urlObject) {
    return res.status(404).send("This URL does not exist!")
  }

  // Does URL belong to current user 
  const urlBelongsToCurrentUser = urlObject.user_id === user_id;
  if (!urlBelongsToCurrentUser) {
    return res.status(403).send("This URL does not belong to this user!")
  }

    delete urlDatabase[req.params.id];
    res.redirect("/urls");

});

/////////GET registration
app.get("/register", (req, res) => {
  const userExists = req.session.user_id
  if (!userExists) {
  return res.render("register");
  }
  return res.redirect("/urls")
});

/////////POST registration
app.post("/register", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const hashedPassword = bcrypt.hashSync(password, 10);

  //If email or password field is empty
  if (!email || !password) {
    return res.status(400).send("Please input an email and password");
  }

  //Adding user if they dont exist
  const foundUser = getUserByEmail(email, users);
  
  if (!foundUser) {
    const user_id = generateRandomString(3);
    users[user_id] = {
      id: user_id,
      email,
      password: hashedPassword
    };
    
    req.session.user_id = users[user_id].id;
    console.log(req.session.user_id);
    res.redirect("/urls");
  } else {
    return res.status(400).send('Email address is already in use');
  }
});

/////////GET login
app.get("/login", (req, res) => {
  const userExists  = req.session.user_id;
  if (!userExists) {
    return res.render("login");
  }
  res.redirect("/urls")
});

/////////POST login
app.post("/login", (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const hashedPassword = bcrypt.hashSync(password, 10);
    
  //Does the user exist already?
  const foundUser = getUserByEmail(email, users);
  if (!foundUser) { 
    return res.status(403).send("Cannot not find user with that email. Please go to /register to make an account");
  } 
  //Do the passwords match?
  const passwordMatch = bcrypt.compareSync(password, hashedPassword)
     if (!passwordMatch) {
        return res.status(403).send("Password does not match");
      } 
        const user_id = foundUser.id;
        req.session.user_id = users[user_id].id;
        res.redirect("/urls");
});

/////////POST Logout
app.post("/logout", (req, res) => {
  req.session = null;
  res.redirect("/login");
});

