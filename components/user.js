const User = require('../models/userModel');

const createUser = async(req, res) => {
    try {
        const userData = req.body;
        const newUser = new User(userData);
        await newUser.save();
        req.session.id = newUser._id;
        res.status(201).json(newUser);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

const updateUser = async(req, res) => {
    try{
        const user = await User.findByIdAndUpdate(req.session.id, req.body, {new: true});
        if(!user){
            return res.status(404).json({ message: "User not found" });
        }
        res.json(user);
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
        res.status(200).json({ message: "User deleted successfully" });
    }
    catch(error){
        res.status(500).json({ message: error.message });
    }
}
module.exports = {createUser, updateUser, deleteUser};