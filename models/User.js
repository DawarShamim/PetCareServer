const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    Pulse: {
        type: String,
        default: ""
    },
    longitude: {
        type: String,
        default: ""
    },
    latitude: {
        type: String,
        default: ""
    }
}
    , { timestamps: true }
);

userSchema.pre('save', async function (next) {
    // Only hash the password if it's modified (or new)
    if (!this.isModified('password')) {
        return next();
    }

    const passwordRegex = /^(?=(.*\d){1,})(?=(.*\W){1,})(?!.*\s).{8,20}$/;
    if (!passwordRegex.test(this.password)) {
        const error = new Error('Password does not meet the requirements.');
        return next(error);
    }

    try {
        // hashing the password with 10 salt rounds
        const hashedPassword = await bcrypt.hash(this.password, 10);

        // Replace the plain password with the hashed one
        this.password = hashedPassword;
        next();
    } catch (error) {
        next(error);
    }
});


const User = mongoose.model('User', userSchema);
module.exports = User;
