const express = require('express');
const router = express.Router();
const {
    getAllUsers,
    registerUser,
    loginUser,
    getUserById,
    updateUser,
    deleteUser
} = require('../controllers/userController');

// Get all users
router.get('/', getAllUsers);

// Register a new user
router.post('/register', registerUser);

// Login user
router.post('/login', loginUser);

// Get a user by ID
router.get('/:id', getUserById);

// Update a user
router.put('/:id', updateUser);

// Delete a user
router.delete('/:id', deleteUser);

module.exports = router;