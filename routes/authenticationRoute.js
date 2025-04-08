const express = require('express');
const router = express.Router();
const User = require('../models/userModel');

// Importing routes
router.get('/login', (req, res) => {
    res.render('login');
});
router.get('/register', (req, res) => {
    res.render('register');
});

router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    console.log(email, " ", password);
    try{
        const user = await User.findOne({email});
        console.log(user);
        console.log(user.password);
        if(!user){
            return res.status(404).json({ message: "User not found" });
        }
        if(user.password != password){
            return res.status(401).json({ message: "Invalid credentials" });
        }
        req.session.userId = user._id;
        console.log(user._id);
        console.log(req.session.userId);
        res.redirect('/dashboard');
    }catch(error){
        res.status(500).json({message: error.message});
    }  
})

module.exports = router;