const mongoose = require('mongoose');
const meetingSchema = new mongoose.Schema(
    {
        meetingRoom: {
            type: String,
            required: [true, "Please provide proper meeting room no"]
        },
        meetTitle: {
            type: String,
            required: [true, 'Please provide the meet agenda']
        },
        meetCreatedBy: {
            type: String,
            required: [true, "Please mention the creator ID"],
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
            expires: 60,
            required: [true, 'Please provide the meeting schedule']
        },

    },
    { timestamps: true }
);

module.exports = mongoose.model('meeting', meetingSchema);