const meeting = require('../models/meeting');
const employee = require('../models/employee');

const { badRequestError, customAPIError } = require('../errors/')

const getAllMeetingDetails = async (req, res) => {
    const allMeetings = await meeting.find({});
    res.status(200).json({ allMeetings });
};

const getIndividualMeetingDetails = async (req, res) => {
    const meetID = req.params.id;

    const individualMeetDetails = await meeting.findOne({ _id: meetID });

    if (individualMeetDetails) {
        res.status(200).json({ individualMeetDetails });
    }
    else {
        throw new badRequestError('Please provide correct meet ID');
    }
};

const createMeetingDetails = async (req, res) => {

    const { meetTitle, meetMembers, meetStartingTime, meetEndingTime } = req.body;
    const meetCreatedBy = req.body.id;

    if (!meetTitle || !meetCreatedBy || !meetStartingTime || !meetEndingTime || !meetMembers) {
        throw new badRequestError('Please provide complete details');
    }
    else {
        const memberAlreadyMeet = [];
        const totalDuration = (meetEndingTime - meetStartingTime) / 3600000;
        const memberName = [];

        for (let i = 0; i < meetMembers.length; i++) {
            const memberResult = await employee.findOne({ _id: meetMembers[i] }).select('name');
            memberName.push(memberResult.name);
            const isMemberConflict = await meeting.findOne({ meetMembers: meetMembers[i], meetStartingTime: meetStartingTime, meetEndingTime: meetEndingTime });

            if (isMemberConflict) {
                memberAlreadyMeet.push(memberName[i]);
            }
        }

        if (memberAlreadyMeet.length == 0) {
            const createMeeting = await meeting.create({ meetTitle, meetCreatedBy, meetMembers, meetStartingTime, meetEndingTime });
            res.status(201).json({ createMeeting, msg: "Meet created successfully" });
        }
        else {
            throw new badRequestError(`[${memberAlreadyMeet}] is already in meet for particular slot`);
        }
    }
}


const updateIndividualMeetingDetails = async (req, res) => {
    const { meetTitle, meetMembers, meetStartingTime, meetEndingTime } = req.body;
    const meetID = req.params.id;
    const meetCreatedBy = req.body.id;

    if (!meetTitle || !meetCreatedBy || !meetStartingTime || !meetEndingTime || !meetMembers) {
        throw new badRequestError('Please provide any details');
    }
    else {
        const isMeet = await meeting.findOne({ _id: meetID });
        if (isMeet) {
            const memberAlreadyMeet = [];
            const totalDuration = (meetEndingTime - meetStartingTime) / 3600000;
            const memberName = [];

            for (let i = 0; i < meetMembers.length; i++) {
                const memberResult = await employee.findOne({ _id: meetMembers[i] }).select('name');
                memberName.push(memberResult.name);
                const isMemberConflict = await meeting.findOne({ meetMembers: meetMembers[i], meetStartingTime: meetStartingTime, meetEndingTime: meetEndingTime });

                if (isMemberConflict) {
                    memberAlreadyMeet.push(memberName[i]);
                }
            }

            if (memberAlreadyMeet.length == 0) {
                const updateMeeting = await meeting.findByIdAndUpdate({ _id: meetID }, { meetTitle, meetCreatedBy, meetMembers, meetStartingTime, meetEndingTime }, { new: true, runValidators: true });
                res.status(200).json({ updateMeeting, msg: "Meet updated successfully" });
            }
            else {
                throw new badRequestError(`[${memberAlreadyMeet}] is already in meet slot`);
            }
        }
        else {
            throw new badRequestError(`No meeting found with the ID`);
        }
    }
};

const deleteMeeting = async (req, res) => {
    const meetID = req.params.id;

    const deleteMeet = await meeting.findByIdAndRemove({ _id: meetID });

    if (deleteMeet) {
        res.status(200).json({ deleteMeet, msg: "Meeting deleted succesfully" });
    }
    else {
        throw new badRequestError('Please provide correct meet ID');
    }
};

const abortFromMeeting = async (req, res) => {
    const userID = req.body.id;
    const meetID = req.params.id;

    const isUserMeet = await meeting.findOne({ _id: meetID, meetMembers: userID });
    if (isUserMeet) {
        const abortMeet = await meeting.updateOne(
            {
                _id: meetID
            },
            {
                $pull: {
                    meetMembers: userID
                }
            },
        );

        if (abortMeet) {
            res.status(200).json({ abortMeet, msg: `${userID} abort the meet participation` });
        }
    }
    else {
        throw new badRequestError('Please provide correct meet ID or User not in Meet');
    }

};

module.exports = { getAllMeetingDetails, createMeetingDetails, getIndividualMeetingDetails, abortFromMeeting, updateIndividualMeetingDetails, deleteMeeting }