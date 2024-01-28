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
        const email = req.body?.Email;
        const password = req.body?.Password;
        let user = await User.findOne({ email: email });
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        const passwordMatch = await bcrypt.compare(password, user.password);
        // const passwordMatch = (password === user.password);
        if (!passwordMatch) {
            return res.status(401).json({ success: false, message: 'Invalid password' });
        }
        const token = jwt.sign(
            {
                user_id: user._id,
                email: user.email,
                name: user.name,
                phone: user.phone
            },
            jwtKey
        );

        return res.status(200).json({ success: true, message: 'Login successful', token });
    } catch (err) {
        return res.status(500).json({ success: false, message: 'Failed to login', error: err.message });
    }
};

exports.register = async (req, res, next) => {

    try {
        const name = req.body?.Name;
        const email = req.body?.Email;
        const password = req.body?.Password;
        const phone = req.body?.Phone;
        const confirmPassword = req.body?.ConfirmPassword;

        // Check if the username or email already exists
        const existingUser = await User.findOne({ email: email });

        if (existingUser) {
            return res.status(400).json({ success: false, message: 'Username already exists' })
        }

        // Create a new user entry in the database
        const newUser = await User.create({
            email: email,
            password: password,
            name: name,
            phone: phone
        });

        // Generate JWT token for the new user
        const token = jwt.sign(
            {
                user_id: newUser.user_id,
                email: newUser.email,
                name: newUser.name
            },
            jwtKey
        );

        return res.status(200).json({ success: true, message: 'Registration successful', token });
    } catch (err) {
        return res.status(500).json({ success: false, message: 'Failed to register', error: err.message });
    }
};

exports.getPulse = async (req, res, next) => {

    try {
        const UserId = req.user.id
        // Check if the username or email already exists
        const existingUser = await User.findById(UserId);

        if (existingUser && existingUser.Pulse) {
            let petPulse = existingUser.Pulse;
            return res.status(200).json({ success: true, message: 'Current Pulse', petPulse, "Last Updated": existingUser.updatedAt });
        }


        return res.status(400).json({ success: false, message: 'Not able to get Pulse Rate' })
    } catch (err) {
        return res.status(500).json({ success: false, message: 'Connection Failed' });
    }
};

exports.getLocation = async (req, res, next) => {
    try {
        const UserId = req.user.id
        const existingUser = await User.findById(UserId);

        if (existingUser && existingUser.longitude && existingUser.latitude) {
            let locationData = [existingUser.longitude, existingUser.latitude];
            return res.status(200).json({ success: true, message: 'Current Location', Coordinates: locationData, "Last Updated": existingUser.updatedAt });
        }

        return res.status(400).json({ success: false, message: 'Not able to get Location' })
    } catch (err) {
        return res.status(500).json({ success: false, message: 'Connection Failed', error: err.message });
    }
};

exports.setPulse = async (req, res, next) => {
    try {
        const UserId = req.user.id
        // Check if the username or email already exists
        const existingUser = await User.findByIdAndUpdate(UserId, { Pulse: req.body.Pulse });

        if (existingUser) {
            return res.status(200).json({ success: true, message: 'updated Pulse' });
        }
        return res.status(400).json({ success: false, message: 'Not able to get Location' })
    } catch (err) {
        return res.status(500).json({ success: false, message: 'Connection Failed', error: err.message });
    }
};

exports.getLocAndPulse = async (req, res, next) => {
    try {
        const UserId = req.user.id
        // Check if the username or email already exists
        const existingUser = await User.findById(UserId);

        if (existingUser && existingUser.longitude && existingUser.latitude & existingUser.Pulse) {

            let locationData = [existingUser.longitude, existingUser.latitude];
            return res.status(200).json({ success: true, message: 'updated Location And Pulse', Coordinates: locationData, Pulse: existingUser.Pulse, "Last Updated": existingUser.updatedAt });
        }

        return res.status(400).json({ success: false, message: 'Not able to get Location' })
    } catch (err) {
        return res.status(500).json({ success: false, message: 'Connection Failed', error: err.message });
    }
};







