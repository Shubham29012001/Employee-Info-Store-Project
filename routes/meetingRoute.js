const express = require('express');
const router = express.Router();

const { getMeetingByIndividual, getAllMeetingDetails, abortFromMeeting, createMeetingDetails, getIndividualMeetingDetails, updateIndividualMeetingDetails, deleteMeeting } = require('../controllers/meetingController');

router.route('/').get(getAllMeetingDetails).post(createMeetingDetails);
router.route('/:id').get(getIndividualMeetingDetails).put(updateIndividualMeetingDetails).delete(deleteMeeting);
router.route('/abort/:id').post(abortFromMeeting);
router.route('/individual').post(getMeetingByIndividual);



module.exports = router;