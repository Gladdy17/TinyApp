const express = require('express');
const app = express();
const cookieParser = require("cookie-parser");
const port = 8080;
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
  let result = '';
  const characters = 'ABCDEFGHIJKLMONPQRSTVWXYZabcdefghifklmnopqrst';
  for (let i = 0; i < characters.length; i++) {
    result += characters[i];
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




const urlDatabase = {
  b2xVn2: "http://www.lighthouselabs..ca",
  "9sm5xK": "http://www.google.com",
};

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
  const user = users[userId] || null; // Retrieve the user or set to null if not found
  const templateVars = { user, urls: urlDatabase }; // Pass the user object to the template
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  const userId = req.cookies["user_id"]; // Retrieve the user_id from the cookies
  if(!userId || !users[userId]){   // added if statement for redirect logic
    return res.redirect("/login");
  }
  const user = users[userId] 
  const templateVars = { user };        // Pass the user object to the template
  res.render("urls_new", templateVars); // Render the urls_new template
});

app.get('/urls/:id', (req, res) => {
  const id = req.params.id;
  const longURL = urlDatabase[id];
  if(!longURL){
    return res.status(404).send("<h2>Sorry, the Url does not exist.</h2>")
  }
  const templateVars = { id, longURL};
  res.render("urls_show", templateVars);
});

app.post("/urls", (req, res) => {
  const id = generateRandomString();
  const longURL = req.body.longURL;
  urlDatabase[id] = longURL; // Log the POST request body to the console
  // res.send("Ok");
  res.redirect(`/urls/${id}`); // Respond with 'Ok' (we will replace this)
});

app.post("/urls/:id/delete",(req, res) =>{
  const id = req.params.id;
  delete urlDatabase[id];
  res.redirect('/urls');
});
app.post("/urls/:id", (req, res) => {
  const username = req.cookies["username"];
  const templateVars = {
    username: username,
  };
  const id = req.params.id;
  const longURL = req.body.longURL;
  urlDatabase[id] = longURL;
  res.redirect(`/urls/${id}`);
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
  if (!foundUser || foundUser.password !== password) {
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







const userID = generateRandomId();

  users[userID] = {
    id: userID,
    email,
    password,
  };
  res.cookie("user_id", userID);
  
  res.redirect('/urls')

})


app.listen(port,()=>{
  console.log(`Examples app listening on port ${port}`);
});


