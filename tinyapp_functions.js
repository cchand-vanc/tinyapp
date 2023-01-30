// Creates unique to identify each Short URL
function generateRandomString(length) {
  let randomString = "";
  const potentialChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890abcdefghijklmnopqrstuvwxyz";
  for (let i = 0; i < length; i ++) {
    randomString += potentialChars.charAt(Math.random() * potentialChars.length);
  }
  return randomString;
};

// Searches user database to verify if user is already registered
function getUserByEmail(email, users) {
  for (let user in users) {
    if (users[user].email === email){
    return users[user];
    }  
  }
  return null;
};

// Searches URL database to find the URLs already created by the user
function urlsForUser(id, urlDatabase) {
  const foundURLs = {};
  for (let url in urlDatabase) {
    const urlEntry = urlDatabase[url];
    if (urlEntry.userId === id) {
      foundURLs[url] = urlDatabase[url].longURL;
    }
  }

  if (Object.keys(foundURLs).length === 0) {
    return null;
  } else {
    return foundURLs;
  }
};



module.exports = { generateRandomString, getUserByEmail, urlsForUser };