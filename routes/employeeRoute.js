const express = require('express');
const router = express.Router();

const { getEmployeeDetails, getIndividualEmployeeDetails, deleteIndividualEmployeeDetails, updateIndividualEmployeeDetail } = require('../controllers/employeeController')

router.route('/').get(getEmployeeDetails);
router.route('/employee/:id').get(getIndividualEmployeeDetails).delete(deleteIndividualEmployeeDetails).put(updateIndividualEmployeeDetail);

module.exports = router;