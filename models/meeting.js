const mongoose = require('mongoose');
const meetingSchema = new mongoose.Schema(
    {
        meetTitle: {
            type: String,
            required: [true, 'Please provide the meet agenda']
        },
        meetCreatedBy: {
            type: String,
            required: [true, "Please mention the creator ID"],
            ref: "employee",
        },
        meetMembers: [
            {
                type: String
            }
        ],
        meetStartingTime: {
            type: Date,
            required: [true, 'Please provide the meeting schedule']
        },
        meetEndingTime: {
            type: Date,
            required: [true, 'Please provide the meeting schedule']
        },
        
    },
    { timestamps: true }
);

module.exports = mongoose.model('meeting', meetingSchema);