const express = require('express');
const router = express.Router();

const { createUser, deleteUser, updateUser} = require('../components/user');

// Create a new user
router.post('/', (req, res) => {
    console.log("Creating user...");
    createUser(req, res);
});
// Update a user
router.patch('/:id', updateUser);
// Delete a user
router.delete('/:id', deleteUser);

module.exports = router;