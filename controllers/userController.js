const User = require('../models/User'); // Import your User model
const bcrypt = require('bcryptjs');

const jwt = require('jsonwebtoken');
const passport = require("passport");


require("dotenv").config();
const jwtKey = process.env.jwtEncryptionKey;

exports.updatePassword = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const oldPassword = req.body?.oldPassword;
        const newPassword = req.body?.newPassword;
        // Find the user by their ID
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        // Check if the old password matches the stored hashed password
        const passwordMatch = await bcrypt.compare(oldPassword, user.password);

        if (!passwordMatch) {
            return res.status(401).json({ message: 'Old password is incorrect' });
        }
        user.password = newPassword;
        await user.save();
        res.status(200).json({ message: 'Password updated successfully' });
    } catch (error) {
        next(error);
    }
};

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body;
        if (!email.trim()) {
            return res.status(400).json({ success: false, message: 'Please provide a valid email address' });
        }

        // Check if the password is empty or doesn't meet your criteria
        if (!password.trim()) {
            return res.status(400).json({ success: false, message: 'Password must have at least one symbol, one digit, and be at least 8 characters long' });
        }
        let user = await User.findOne({ email: email }).select("+password").lean();

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        const { password: hashedpassword, ..._user } = user;
        const passwordMatch = await bcrypt.compare(password, hashedpassword);

        if (!passwordMatch) {
            return res.status(401).json({ success: false, message: 'Invalid password' });
        }
        const token = jwt.sign(
            {
                user_id: user._id,
                email: user.email,
            },
            jwtKey
        );
        console.log(_user)
        return res.status(200).json({ success: true, message: 'Login successful', user: _user, token });
    } catch (err) {
        return res.status(500).json({ success: false, message: 'Failed to login', error: err.message });
    }
};

exports.register = async (req, res, next) => {
    try {
        const { name, email, password, phone, petType, petAge, petAgeGroup, petBreed, petGender } = req.body;

        if (!name || !email || !password || !phone || !petGender || !petAgeGroup || !petAge || !petType || !petBreed) {
            return res.status(400).json({ success: false, message: 'All fields are required' });
        }

        if (!email.trim() || !isValidEmail(email)) {
            return res.status(400).json({ success: false, message: 'Please provide a valid email address' });
        }

        // Check if the password is empty or doesn't meet your criteria
        if (!password.trim() || !isValidPassword(password)) {
            return res.status(400).json({ success: false, message: 'Password must have at least one symbol, one digit, and be at least 8 characters long' });
        }

        // Check if the username or email already exists
        const existingUser = await User.findOne({ email: email });

        if (existingUser) {
            return res.status(400).json({ success: false, message: 'Email already exists' })
        }

        const newUser = await User.create({
            email,
            password,
            name,
            phone,
            petType,
            petAge,
            petAgeGroup,
            petBreed,
            petGender,
        });

        const token = jwt.sign(
            {
                user_id: newUser.user_id,
                email: newUser.email,
            },
            jwtKey
        );

        return res.status(200).json({ success: true, message: 'Registration successful', user: newUser, token });
    } catch (err) {
        return res.status(500).json({ success: false, message: 'Failed to register', error: err.message });
    }
};

exports.updateProfile = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { name, phone, petType, petAge, petAgeGroup, petBreed, petGender } = req.body;

        if (!name || !phone || !petGender || !petAgeGroup || !petAge || !petType || !petBreed) {
            return res.status(400).json({ success: false, message: 'All fields are required' });
        }

        const existingUser = await User.findOneAndUpdate({ _id: userId }, {
            name,
            phone,
            petType,
            petAge,
            petAgeGroup,
            petBreed,
            petGender,
        }, { new: true });

        if (existingUser) {
            return res.status(400).json({ success: false, message: 'Error Updating Profile' })
        }

        return res.status(200).json({ success: true, message: 'Registration successful', user: existingUser, token });
    } catch (err) {
        return res.status(500).json({ success: false, message: 'Failed to register', error: err.message });
    }
};

exports.attachDevice = async (req, res, next) => {
    try {
        const userId = req.user.id;
        const { DeviceId } = req.body;

        if (!DeviceId) {
            return res.status(400).json({ success: false, message: 'All fields are required' });
        }

        const existingUser = await User.findOneAndUpdate({ _id: userId }, {
            channelNumber: DeviceId,
        }, { new: true });

        if (existingUser) {
            return res.status(400).json({ success: false, message: 'Error Connecting Device' })
        }

        return res.status(200).json({ success: true, message: 'Registration successful', user: existingUser, token });
    } catch (err) {
        return res.status(500).json({ success: false, message: 'Failed to register', error: err.message });
    }
};

function isValidPassword(password) {
    // Password must have at least one letter, one symbol, one digit, and be at least 8 characters long
    const passwordRegex = /^(?=.*[a-zA-Z])(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?~\\/-])(?=.*\d).{8,}$/;
    return passwordRegex.test(password);
}

function isValidEmail(email) {
    // Use a regular expression or any other method to validate the email format
    // For simplicity, a basic email format check is shown here
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}




