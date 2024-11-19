const express = require('express');
const app = express();
const cookieParser = require("cookie-parser");
const port = 8080;
// const cookieSession = require('cookie-session')

app.set('view engine', 'ejs');

app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));


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
  const user = users[userId] || null;   // Retrieve the user object from the users database
  const templateVars = { user };        // Pass the user object to the template
  res.render("urls_new", templateVars); // Render the urls_new template
});

app.get('/urls/:id', (req, res) => {
  const templateVars = { id: req.params.id, longURL: urlDatabase[req.params.id]};
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
  const username = req.body.username;
  // res.cookie('username', username);
  res.redirect('/urls');
    
});

app.post("/logout", (req, res) => {
  res.clearCookie('username');
  res.redirect('/urls');
});


app.get("/register", (req, res) => {
  res.render("register")


});

app.post("/register", (req, res) => {
  const {email, password } = req.body;

  if(!email || !password){
    return res.status(400).send("Email and password cannot be empty");
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


