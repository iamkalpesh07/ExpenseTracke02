require('dotenv').config();
const express = require('express');
const session = require("express-session");
const server = express();
const path = require('path');
const mongoose = require('mongoose');
mongoose.connect(process.env.MONGODB_URI).then(() => console.log("\x1b[32m%s\x1b[0m",'Communication established with bank')).catch((err) => console.error("\x1b[31m%s\x1b[0m", 'Bank Network Down: ', err));
server.use(express.json());
server.set("view engine", "ejs");
server.set("views", path.join(__dirname, "views"));
server.use(express.static(path.join(__dirname, "public")));
server.use(express.json());
server.use(express.urlencoded({ extended: true }));
server.use(session({
    secret: "CodeZero", 
    resave: false,        
    saveUninitialized: true,  
    cookie: { maxAge: 10 * 24 * 60 * 60 * 1000 } // 1 day
}));

// Importing routes
const userRoute = require('./routes/userRoute');
const transactionRoute = require('./routes/transactionRoute');
server.use('/user/', userRoute);
server.use('/transaction/', transactionRoute);
// Routes
server.get("/login",(req, res)=>{
    res.render("login");
})
server.get("/register",(req, res)=>{
    res.render("register");
})
server.get("/createUser",(req, res)=>{
    res.render("userCreate");
})
server.get("/createTransaction",(req, res)=>{
    res.render("createTransaction");
})
server.get("/home",(req, res)=>{
    res.render("index");
})

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log("Server listening at http://localhost:"+PORT);
});