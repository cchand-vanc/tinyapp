function generateRandomString(length) {
  let randomString = "";
  const potentialChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890abcdefghijklmnopqrstuvwxyz";
  for (let i = 0; i < length; i ++) {
    randomString += potentialChars.charAt(Math.random() * potentialChars.length);
  }
  return randomString;
};

function getUserByEmail(email) {
  for (let user in users) {
    if (users[user].email === email && users[user].password !== password) {
      return res.status(400).send('Email address is already in use');
    }
  }
};


module.exports = { generateRandomString, getUserByEmail };