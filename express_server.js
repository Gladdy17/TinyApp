const express = require('express');
const app = express();
const cookieParser = require("cookie-parser");
const port = 8080;
const bcrypt = require("bcryptjs");
// const cookieSession = require('cookie-session')

app.set('view engine', 'ejs');

app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use((req, res, next) => {
  console.log("Cookies:", req.cookies); // Check the cookies object
  console.log("Users object:", users); // Check the users object
  
  const userId = req.cookies["user_id"]; // This might be undefined
  const user = users[userId] || null;   // This line is likely causing the issue
  
  console.log("User ID:", userId);
  console.log("User:", user);

  res.locals.user = user; // If undefined, it will still log as null
  next();
});


const generateRandomId = () => `user${Math.random().toString(24).substring(3,7)}`;

function generateRandomString() {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < 6; i++) { // Adjust length as needed
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}


const users = {
  userRandomID: {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur",
  },
  user2RandomID: {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk",
  },
};


function urlsForUser(id) {
  const userUrls = {};
  for (const shortURL in urlDatabase) {
    if (urlDatabase[shortURL].userID === id) {
      userUrls[shortURL] = urlDatabase[shortURL];
    }
  }
  return userUrls;
}



const urlDatabase = {
  b6UTxQ: {
    longURL: "https://www.tsn.ca",
    userID: "aJ48lW",
  },
  i3BoGr: {
    longURL: "https://www.google.ca",
    userID: "aJ48lW",
  },
};

function urlsForUser(id) {
  const userUrls = {};
  for (const shortURL in urlDatabase) {
    if (urlDatabase[shortURL].userID === id) {
      userUrls[shortURL] = urlDatabase[shortURL];
    }
  }
  return userUrls;
}




app.get('/', (req, res)=> {
  res.send("Hello");
});

app.get('/hello', (req,res) =>{
  res.send('<html><body>Hello <b>World</b></body></html>');
});

app.get('/urls.json', (req, res) => {
  res.json(urlDatabase);
});

app.get("/urls", (req, res) => {
  const userId = req.cookies["user_id"];

  if (!userId || !users[userId]) {
    return res.status(403).send("<h1>Please log in or register to view your URLs.</h1>");
  }

  const userUrls = urlsForUser(userId);
  const templateVars = { user: users[userId], urls: userUrls };
  res.render("urls_index", templateVars);
});


app.get("/urls/new", (req, res) => {
  const userId = req.cookies["user_id"];
  if (!userId || !users[userId]) {
    return res.redirect("/login");
  }

  const templateVars = { user: users[userId] };
  res.render("urls_new", templateVars);
});



app.get("/urls/:id", (req, res) => {
  const userId = req.cookies["user_id"];
  const url = urlDatabase[req.params.id];

  if (!userId || !users[userId]) {
    return res.status(403).send("<h1>You must be logged in to view this page.</h1>");
  }

  if (!url) {
    return res.status(404).send("<h1>This shortened URL does not exist.</h1>");
  }

  if (url.userID !== userId) {
    return res.status(403).send("<h1>You do not have permission to access this URL.</h1>");
  }

  const templateVars = { id: req.params.id, longURL: url.longURL, user: users[userId] };
  res.render("urls_show", templateVars);
});

app.post("/urls", (req, res) => {
  const userId = req.cookies["user_id"];

  if (!userId || !users[userId]) {
    return res.status(403).send("<h1>You must be logged in to shorten URLs.</h1>");
  }

  const longURL = req.body.longURL; // Extract longURL as a string
  const shortURL = generateRandomString();

  urlDatabase[shortURL] = {
    longURL: longURL,
    userID: userId,
  };

  res.redirect(`/urls/${shortURL}`);
});



app.post("/urls/:id/delete", (req, res) => {
  const userId = req.cookies["user_id"];
  const url = urlDatabase[req.params.id];

  if (!url) {
    return res.status(404).send("<h1>This shortened URL does not exist.</h1>");
  }

  if (!userId || !users[userId]) {
    return res.status(403).send("<h1>You must be logged in to delete URLs.</h1>");
  }

  if (url.userID !== userId) {
    return res.status(403).send("<h1>You do not have permission to delete this URL.</h1>");
  }

  delete urlDatabase[req.params.id];
  res.redirect("/urls");
});



app.post("/urls/:id", (req, res) => {
  const userId = req.cookies["user_id"];
  const url = urlDatabase[req.params.id];

  if (!url) {
    return res.status(404).send("<h1>This shortened URL does not exist.</h1>");
  }

  if (!userId || !users[userId]) {
    return res.status(403).send("<h1>You must be logged in to edit URLs.</h1>");
  }

  if (url.userID !== userId) {
    return res.status(403).send("<h1>You do not have permission to edit this URL.</h1>");
  }

  const newLongURL = req.body.longURL;
  urlDatabase[req.params.id].longURL = newLongURL;
  res.redirect("/urls");
});


app.post("/login", (req, res) => {
  const { email, password } = req.body;

  console.log("Login attempt:", { email, password }); // Debugging input

  // Find the user by email
  let foundUser = null;
  for (const userId in users) {
    if (users[userId].email === email) {
      foundUser = users[userId];
      break;
    }
  }

  console.log("Found user:", foundUser); // Debugging user lookup

  // If user not found or password is incorrect, send error
  if (!foundUser) {
    console.log("Invalid email or password.");
    return res.status(403).send("Invalid email or password.");
  }

  // Compare the hashed password with the entered password
  if (!bcrypt.compareSync(password, foundUser.password)) {
    console.log("Invalid email or password.");
    return res.status(403).send("Invalid email or password.");
  }

  // Set the user_id cookie and redirect
  res.cookie("user_id", foundUser.id);
  console.log("User logged in successfully:", foundUser.id); // Debugging successful login
  res.redirect("/urls");
});




app.get("/login", (req, res) =>{
  res.render("login")
})


app.post("/logout", (req, res) => {
  res.clearCookie('user_id');
  res.redirect('/login');
});


app.get("/register", (req, res) => {
  res.render("register")


});


app.post("/register", (req, res) => {
  const { email, password } = req.body;

  // Check if email or password is empty
  if (!email || !password) {
    return res.status(400).send("Email and password cannot be empty.");
  }

  // Check if the email is already registered
  for (let user_id in users) {
    if (users[user_id].email === email) {
      return res.status(400).send("Email is already registered.");
    }
  }

const hashedPassword = bcrypt.hashSync(password, 10);  
const userID = generateRandomId();

  users[userID] = {
    id: userID,
    email,
    password: hashedPassword,
  };
  res.cookie("user_id", userID);
  
  res.redirect('/urls')

})


app.listen(port,()=>{
  console.log(`Examples app listening on port ${port}`);
});


