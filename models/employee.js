const mongoose = require('mongoose');

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
            unique: true,
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
            type: String,
            required: [true, 'Please provide the dob of employee'],
            maxLength: 10,
            minLength: 10,
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
    },
    { timestamps: true }
);

module.exports = mongoose.model('employee', employeeSchema);