const express = require('express');
const app = express();
const port = 8080;
// const cookieSession = require('cookie-session')

app.set('view engine', 'ejs');


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
  const templateVars = { urls: urlDatabase };
  res.render('urls_index', templateVars);
});


app.get("/urls/new", (req, res) => {
  res.render("urls_new");
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
app.post("/urls/:id", (req, res) =>{
  const id = req.params.id;
  const longURL = req.body.longURL;
  urlDatabase[id] = longURL;
  res.redirect(`/urls/${id}`);
});

app.post("/login", (req, res) =>{
    res.cookie('Username', 'Username');
    res.send('Welcome Your logged In !!')
    
});

app.listen(port,()=>{
  console.log(`Examples app listening on port ${port}`);
});


