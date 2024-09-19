const express = require('express');
const app = express();
const ejs = require("ejs")
const mongoose = require("mongoose")


app.use(express.urlencoded({extended:true}))
app.set("view engine", "ejs")

let userarray = []
let todoarray = []
let errormssg
let errormessage

const userSchema = mongoose.Schema({
    fullname:{type:String},
    username:{type:String},
    email:{type:String},
    password:{type:Number},
    confirmpassword:{type:Number},
})

const usermodel = mongoose.model("user_collection", userSchema)


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

app.post('/register', async(req,res)=>{
    try {
        console.log(req.body);
    const createuser = await usermodel.create(req.body);
    if (createuser) {
        console.log("user created successfully");
    }else {
        console.log('unable to create user');
    }
    } catch (error) {
        console.log(error);
    }
    // let existuser = userarray.find((user)=> user.email === req.body.email)
    // if(existuser){
    //     errormssg = 'user already exists'
    //     res.redirect("/signup")
    // }else{
    //     errormssg = ''
    //     userarray.push(req.body)
    //     console.log(userarray);
    //     res.redirect('/login')
    // }
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
    // console.log(req.body);
    todoarray.push(req.body)
    console.log(todoarray);
    res.redirect('/todo')
})


app.get("/edit/:i",(req, res)=>{
    console.log(req.params);
    const{ i } = req.params
    console.log(i);
    let editTodo = todoarray[i]
    res.render("edit", {editTodo , i})
})

app.post("/editted/:i",(req , res)=>{
    console.log(req.body);
    const { i } = req.params
    let change = req.body
    todoarray[i] = change
    res.redirect("/todo")
    
})

app.post("/delete",(req, res)=>{
    console.log(req.params);
    let i = req.params.i
    console.log(i);
    todoarray.splice(i,1)
    console.log(req.params);
    res.redirect("/todo")
})




const uri = "mongodb+srv://Anonjay:Ishola04@cluster0.rnlpg.mongodb.net/nodeClass?retryWrites=true&w=majority&appName=Cluster0";


const db_connect = async ()=>{
    try{
        // mongoose.connect(uri).then((res) => {
        //     console.log("connected to database");
        // })
    const connection = await mongoose.connect(uri)
    if (connection) {
        console.log("connected to database");
    }
    } catch (error){
        console.log(error);
    }
}

db_connect()

const port = 9005;


app.listen(port,()=> {
    console.log(`app started on port ${port} `);
    
});