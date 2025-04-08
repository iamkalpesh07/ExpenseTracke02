const User = require('../models/userModel');
const express = require('express');

const createUser = async(req, res) => {
    try {
        const userData = req.body;
        const newUser = new User(userData);
        await newUser.save();
        req.session.userId = newUser._id;
        res.redirect('/dashboard');
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const updateUser = async(req, res) => {
    try{
        const user = await User.findByIdAndUpdate(req.session.userId, req.body, {new: true});
        if(!user){
            return res.redirect('/authentication/login');
        }
        res.redirect('/dashboard');
    }
    catch(error){
        res.status(500).json({ message: error.message });
    }
}

const deleteUser = async(req, res) => {
    try{
        const user = await User.findByIdAndDelete(id);
        if(!user){
            return res.status(404).json({ message: "User not found" });
        }
        res.redirect('/login');
    }
    catch(error){
        res.status(500).json({ message: error.message });
    }
}

module.exports = {createUser, updateUser, deleteUser};