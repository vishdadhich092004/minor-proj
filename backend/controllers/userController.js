const User = require('../model/user');
const jwt = require('jsonwebtoken');

// Generate JWT for user
const generateToken = (id, role) => {
    return jwt.sign({ sub: id, role }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

// @desc    Get all users
// @route   GET /users
// @access  Public (should be Admin in production)
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password'); // Don't return passwords
        res.json({ success: true, message: "Users retrieved successfully.", data: users });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Register a new user
// @route   POST /users/register
// @access  Public
const registerUser = async (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
        return res.status(400).json({ success: false, message: "Name, email, and password are required." });
    }

    try {
        // Check if a user with this email already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ success: false, message: "A user with this email already exists." });
        }

        const user = await User.create({ name, email, password });

        if (user) {
            res.status(201).json({
                success: true,
                message: "User created successfully.",
                data: {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    token: generateToken(user._id, user.role)
                }
            });
        } else {
            res.status(400).json({ success: false, message: "Invalid user data" });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Login user
// @route   POST /users/login
// @access  Public
const loginUser = async (req, res) => {
    const { email, password } = req.body;

    try {
        // Check if the user exists by email
        const user = await User.findOne({ email });

        if (user && (await user.matchPassword(password))) {
            res.status(200).json({
                success: true,
                message: "Login successful.",
                data: {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    token: generateToken(user._id, user.role)
                }
            });
        } else {
            return res.status(401).json({ success: false, message: "Invalid email or password." });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Get user by ID
// @route   GET /users/:id
// @access  Public
const getUserById = async (req, res) => {
    try {
        const userID = req.params.id;
        const user = await User.findById(userID).select('-password');
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found." });
        }
        res.json({ success: true, message: "User retrieved successfully.", data: user });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Update user
// @route   PUT /users/:id
// @access  Public
const updateUser = async (req, res) => {
    try {
        const userID = req.params.id;
        const { name, email, password } = req.body;

        const user = await User.findById(userID);

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found." });
        }

        user.name = name || user.name;
        user.email = email || user.email;
        if (password) {
            user.password = password; // Will be hashed by pre-save hook
        }

        const updatedUser = await user.save();

        res.json({
            success: true,
            message: "User updated successfully.",
            data: {
                _id: updatedUser._id,
                name: updatedUser.name,
                email: updatedUser.email,
                role: updatedUser.role
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// @desc    Delete user
// @route   DELETE /users/:id
// @access  Public
const deleteUser = async (req, res) => {
    try {
        const userID = req.params.id;
        const deletedUser = await User.findByIdAndDelete(userID);
        if (!deletedUser) {
            return res.status(404).json({ success: false, message: "User not found." });
        }
        res.json({ success: true, message: "User deleted successfully." });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    getAllUsers,
    registerUser,
    loginUser,
    getUserById,
    updateUser,
    deleteUser
};
