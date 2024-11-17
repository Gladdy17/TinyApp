const express = require('express');
const app = express();
const cookieParser = require("cookie-parser");
const port = 8080;
// const cookieSession = require('cookie-session')

app.set('view engine', 'ejs');

app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));


function generateRandomString() {
  let result = '';
  const characters = 'ABCDEFGHIJKLMONPQRSTVWXYZ';
  for (let i = 0; i < characters.length; i++) {
    result += characters[i];
  }
  return result;
}


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


app.get('/urls', (req, res) =>{
  const templateVars = {
    urls: urlDatabase,
    username: req.cookies['username'],
  };
  res.render('urls_index', templateVars);
});


app.get("/urls/new", (req, res) => {
  const username = req.cookies["username"]; // Get the username from cookies
  const templateVars = {
    username: username, // pass the username to the template
    // other variables can be added here
  };
  res.render("urls_new", templateVars); // render the urls_new template with the username
});

// app.get("/urls/new", (req, res) => {
//   res.render("urls_new");
// });

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

app.post("/logout", (req,res) => {
  res.clearCookie('username');
  res.redirect("/login")
});




app.listen(port,()=>{
  console.log(`Examples app listening on port ${port}`);
});


