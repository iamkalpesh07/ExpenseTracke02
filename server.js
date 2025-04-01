const express = require('express');
const server = express();
const path = require('path');

// Middleware to parse JSON requests
server.use(express.json());
server.set("view engine", "ejs");
server.set("views", path.join(__dirname, "views"));
server.use(express.static(path.join(__dirname, "public")));
server.use(express.json());
server.use(express.urlencoded({ extended: true }));

server.get("/login",(req, res)=>{
    res.render("login");
})
server.get("/register",(req, res)=>{
    res.render("register");
})
server.get("/home",(req, res)=>{
    res.render("index");
})

// Start the server
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log("Server listening at http://localhost:"+PORT);
});