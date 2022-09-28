const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { jwtSecret, accessTokenLife } = require('../config/config');

const employeeSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Please provide the name of employee'],
            maxLength: 50,
            minLength: 5,
        },
        email: {
            type: String,
            required: [true, 'Please provide email'],
            match: [
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
                'Please provide a valid email',
            ],
            unique: [true, 'Email already exists'],
        },
        password: {
            type: String,
            required: [true, 'Please provide password'],
            minlength: 6,
        },
        address: {
            type: String,
            required: [true, 'Please provide the address of employee'],
            maxLength: 50,
            minLength: 15,
        },
        dob: {
            type: Date,
            required: [true, 'Please provide the dob of employee'],
        },
        designation: {
            type: String,
            maxLength: 30,
        },

        reportingTo: {
            type: String,
            maxLength: 30,
        },
        seat: {
            type: String,
            maxLength: 30,
        },
        team: {
            type: String,
            maxLength: 30,
        },
        joiningDate: {
            type: Date,
            default: Date.now
        },
        preferenceStartTime: {
            type: String,
        },
        preferenceEndTime: {
            type: String,
        },
        userType: {
            type: Number,
            default: 255
        }
    },
    { timestamps: true }
);

employeeSchema.pre('save', async function (next) {
    this.password = await bcrypt.hash(this.password, 10);;
    next();
});

employeeSchema.methods.createJWT = function () {
    return jwt.sign({ userId: this._id, name: this.name, email: this.email, userType: this.userType },
        jwtSecret, { expiresIn: accessTokenLife });
};

employeeSchema.methods.comparePassword = async function (password) {
    const comparePass = await bcrypt.compare(password, this.password);
    return comparePass;
}

module.exports = mongoose.model('employee', employeeSchema);