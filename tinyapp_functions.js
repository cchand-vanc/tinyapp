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
  const foundURLs = {};
  for (let url in urlDatabase) {
    const urlEntry = urlDatabase[url];
    if (urlEntry.user_id === id) {
      foundURLs[url] = urlDatabase[url].longURL;
    }
  }
  console.log('urlDatabase:' , urlDatabase);
  if (foundURLs.length < 1) {
    return null;
  } else {
    console.log('foundURLs: ', foundURLs)
    return foundURLs;
  }
};



module.exports = { generateRandomString, getUserByEmail, urlsForUser };