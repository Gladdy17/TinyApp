const express = require('express');
const app = express();
const port = 8080;

app.set('view engine', 'ejs');


app.use(express.urlencoded({ extended: true }));


function generateRandomString(){
    let result = '';
    const characters = 'ABCDEFGHIJKLMONPQRSTVWXYZ';
    for (let i = 0; i < characters.length; i++){
        result +=characters[i];
    }
    return result;
}


const urlDatabase = {
    b2xVn2: "http://www.lighthouselabs..ca",
    "9sm5xK": "http://www.google.com",
};

app.get('/', (req, res)=> {
    res.send("Hello");
})

app.get('/hello', (req,res) =>{
    res.send('<html><body>Hello <b>World</b></body></html>');
});

app.get('/urls.json', (req, res) => {
    res.json(urlDatabase);
})


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
    console.log(req.body); // Log the POST request body to the console
    res.send("Ok"); // Respond with 'Ok' (we will replace this)
  });

app.listen(port,()=>{
    console.log(`Examples app listening on port ${port}`);
});


