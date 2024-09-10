const express = require('express');
const app = express();
const ejs = require("ejs")


app.set("view engine", "ejs")
app.use(express.urlencoded({extended:true}))

let userarray = []
let todoarray = []
let errormssg
let errormessage

app.get('/',(request, response)=>{
    // response.send([
    //     {name:"jide", food:"noodles"},
    //     {name:"jomiloju", food:"rice"},
    //     {name:"oyinda", food:"plantain"},
    //     {name:"victor", food:"yam"},
    //     {name:"tosin", food:"beans"},
    //     {name:"adebayo", food:"amala and abula"}
    // ]);
    // console.log(__dirname);
    
    // response.sendFile(__dirname + '/index.html');
    response.render('index')

});

app.get('/signup',(request, response)=>{
    response.render('signup', {errormssg})
})

app.get('/login',(request, response)=>{
    response.render('login', {errormessage})
})

app.get("/todo", (req,res)=>{
    res.render("todolist", {todoarray})
})

app.post('/register',(req,res)=>{
    console.log(req.body);
    let existuser = userarray.find((user)=> user.email === req.body.email)
    if(existuser){
        errormssg = 'user already exists'
        res.redirect("/signup")
    }else{
        errormssg = ''
        userarray.push(req.body)
        console.log(userarray);
        res.redirect('/login')
    }
})



app.post('/signin',(req,res)=>{
    let confirmuser = userarray.find((individual)=> individual.email === req.body.email && individual.password === req.body.password)
    if (confirmuser) {
        res.redirect('/')
        errormessage = ''
    }else{
        errormessage = 'Invalid email or password'
        res.redirect('/login')
    }
})

app.post("/addtodo",(req,res)=>{
    console.log(req.body);
    todoarray.push(req.body)
    console.log(todoarray);
    res.redirect('/todo')
})








const port = 9005;


app.listen(port,()=> {
    console.log(`app started on port ${port} `);
    
});