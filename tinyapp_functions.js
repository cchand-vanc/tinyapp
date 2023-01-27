function generateRandomString(length) {
  let randomString = "";
  const potentialChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890abcdefghijklmnopqrstuvwxyz";
  for (let i = 0; i < length; i ++) {
    randomString += potentialChars.charAt(Math.random() * potentialChars.length);
  }
  return randomString;
};

function getUserByEmail(email, users) {
  for (let user in users) {
    if (users[user].email === email){
    return users[user];
    }  
  }
  return null;
};

function urlsForUser(id, urlDatabase) {
  const foundURLs = [];
  for (let url in urlDatabase) {
    if (urlDatabase[url].user_id === id) {
      foundURLs.push(urlDatabase[url].longURL);
    }
  }
  if (foundURLs.length < 1) {
    return null;
  } else {
    return foundURLs;
  }
};

const urlDatabase = {
  b2xVn2: {
    longURL: "http://www.lighthouselabs.ca",
    user_id: "b@b"
  },
  i3BoGr: {
    longURL: "http://www.google.com",
    user_id: "c@c",
  },
  abcdef: {
    longURL: "http://www.bbc.co.uk",
    user_id: "c@c",
  },
};


module.exports = { generateRandomString, getUserByEmail, urlsForUser };