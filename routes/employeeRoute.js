const express = require('express');
const router = express.Router();

const { getEmployeesEmail, giveAdminAccess, getEmployeeByTeam, getEmployeeDetails, getIndividualEmployeeDetails, deleteIndividualEmployeeDetails, updateIndividualEmployeeDetail } = require('../controllers/employeeController')

router.route('/').get(getEmployeeDetails);
router.route('/employee/:id').get(getIndividualEmployeeDetails).delete(deleteIndividualEmployeeDetails).put(updateIndividualEmployeeDetail);
router.route('/employee/team/').post(getEmployeeByTeam);
router.route('/emails/').get(getEmployeesEmail);
router.route('/employee/access/:id').put(giveAdminAccess);

module.exports = router;