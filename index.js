const express = require('express');
const app = express();
const ejs = require("ejs")
const mongoose = require("mongoose")


app.use(express.urlencoded({extended:true}))
app.set("view engine", "ejs")

let userarray = []
let todoarray = []
let displayTodo = []
let errormssg
let errormessage

const userSchema = mongoose.Schema({
    fullname:{type:String, trim:true, required:true},
    username:{type:String, trim:true, required:true},
    email:{type:String, trim:true, required:true, unique:true},
    password:{type:Number, trim:true, required:true},
    confirmpassword:{type:Number, trim:true, required:true},
})

const usermodel = mongoose.model("user_collection", userSchema)

const todoSchema = mongoose.Schema({
    title:{type:String, trim:true, required:true},
    content:{type:String, trim:true, required:true}
},{timestamps:true})

const todomodel = mongoose.model("todo-collection", todoSchema)
app.get('/dashboard',(request, response)=>{
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

app.get('/',(request, response)=>{
    response.render('signup', {errormssg})
})

app.get('/login',(request, response)=>{
    response.render('login', {errormessage})
})

app.get("/todo", async (req,res)=>{
    const displayTodo = await todomodel.find()
    console.log(displayTodo);
    res.render("todolist", {displayTodo})
})

app.post('/register', async(req,res)=>{
        console.log(req.body);
    try {
    const createuser = await usermodel.create(req.body);
    if (createuser) {
        console.log("user created successfully");
        res.redirect('/login')
    }else {
        console.log('unable to create user');
        res.redirect('/')
    }
    } catch (error) {
        console.log(error);
    }
    // let existuser = userarray.find((user)=> user.email === req.body.email)
    // if(existuser){
    //     errormssg = 'user already exists'
    //     res.redirect("/")
    // }else{
    //     errormssg = ''
    //     userarray.push(req.body)
    //     console.log(userarray);
    //     res.redirect('/login')
    // }
})


app.post('/signin', async(req,res)=>{
//     try {
//     const confirmuser = await usermodel.findOne({ email: req.body.email });
//     if (!confirmuser) {
//       console.log("Invalid email please sign up");
//       errormessage = 'Invalid email'
//       res.redirect("/login");
//     } else {
//       if (confirmuser.password == req.body.password) {
//         console.log("login successful");
//         errormessage = ''
//         res.redirect("/todo");
//       } else {
//         console.log("Invalid password");
//         errormessage = 'Invalid password'
//         res.redirect("/login");
//       }
//     }
//   } catch (error) {
//     console.log(error);
//     res.redirect("/login");
//   }


    const {email , password} = req.body 
    try {
        const existuser = await usermodel.findOne({email:email})
        console.log(existuser);
        if (existuser && existuser.password == password) {
            console.log("login successful");
            res.redirect("/todo")
        } else {
            console.log("invalid user");
            res.redirect("/login")
        }
    } catch (error) {
        console.log(error);
        res.redirect("/login")
    }   

    // let confirmuser = userarray.find((individual)=> individual.email === req.body.email && individual.password === req.body.password)
    // if (confirmuser) {
    //     res.redirect('/dashboard')
    //     errormessage = ''
    // }else{
    //     errormessage = 'Invalid email or password'
    //     res.redirect('/login')
    // }
})

app.post("/addtodo", async(req,res)=>{
    console.log(req.body);
    try {
        const todo = await todomodel.create(req.body)
    if (todo) {
        console.log("todo created successfully")
        res.redirect('/todo')
    }else{
        console.log("error creating todo");
    }
    } catch (error) {
        console.log(error);
    }
    
})

app.post("/delete/:i", async(req, res)=>{
    const {i} = req.params
    console.log(i);
   try {0
    let deletedproduct = await todomodel.findByIdAndDelete(i)
   if (deletedproduct) {
    console.log('deleted successfully');
    res.redirect("/todo")
   }else{
    console.log('unable to delete');
    
   }
    
   } catch (error) {
    console.log(error);
    
   }
    
    // const{ i } = req.params
    // console.log(i);
    // let editTodo = displayTodo[i]
    // res.render("edit", {editTodo , i})
})

app.get("/edit/:i", async(req, res)=>{
    const { i } = req.params;
    try {
        let editTodo = await todomodel.findById(i); // Fetch todo from DB
        if (editTodo) {
            res.render("edit", { editTodo }); // Pass the todo item to the EJS template
        } else {
            console.log('Todo not found');
            res.redirect("/todo");
        }
    } catch (error) {
        console.log(error);
        res.redirect("/todo");
    }
});

app.post("/editted/:i", async(req , res)=>{
    // console.log(req.body);
    // const { i } = req.params
    // let change = req.body
    // displayTodo[i] = change
    // res.redirect("/todo")
    const { i } = req.params;
    const { title, content } = req.body; 
    try {
        let updatedproduct = await todomodel.findByIdAndUpdate(i, { title, content }, { new: true });
        if (updatedproduct) {
            console.log('Updated successfully');
            res.redirect("/todo");
        } else {
            console.log('Unable to update');
            res.redirect("/edit/" + i);
        }
    } catch (error) {
        console.log(error);
        res.redirect("/edit/" + i);
    }
})

// app.post("/delete",(req, res)=>{
//     console.log(req.params);
//     let i = req.params.i
//     console.log(i);
//     displayTodo.splice(i,1)
//     console.log(req.params);
//     res.redirect("/todo")
// })




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