const express = require('express');
const router = express.Router();

const { getEmployeeByTeam, getEmployeeDetails, getIndividualEmployeeDetails, deleteIndividualEmployeeDetails, updateIndividualEmployeeDetail } = require('../controllers/employeeController')

router.route('/').get(getEmployeeDetails);
router.route('/employee/:id').get(getIndividualEmployeeDetails).delete(deleteIndividualEmployeeDetails).put(updateIndividualEmployeeDetail);
router.route('/employee/team/').post(getEmployeeByTeam);

module.exports = router;