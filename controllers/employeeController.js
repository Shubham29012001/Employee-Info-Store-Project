const employee = require('../models/employee');
const { badRequestError, customAPIError } = require('../errors/')

const getEmployeeDetails = async (req, res) => {
    const { sort, team, designation, reporting, search, limit, page } = req.query;

    let skip = 0;

    if (limit || page) {
        skip = (page - 1) * limit;
    }

    let queryObject = {};

    if (team && team !== 'all') {
        queryObject.team = new RegExp(team, 'i');
    }

    if (designation && designation !== 'all') {
        queryObject.designation = new RegExp(designation, 'i');
    }

    if (reporting) {
        queryObject.reportingTo = new RegExp(reporting, 'i');
    }

    if (search) {
        queryObject.name = new RegExp(`^${search}`, 'i');
    }

    let employees = employee.find(queryObject).select('-password');
    let totalEmployees;
    let numberOfPages;
    let completeEmployee;

    if (limit || page || sort) {
        employees = employees.skip(skip).limit(limit);
        totalEmployees = await employee.countDocuments(queryObject);
        numberOfPages = Math.ceil(totalEmployees / limit);

        completeEmployee = await employees.sort({ 'joiningDate': sort }).select('-password').select('-userType');
        res.status(200).json({ completeEmployee, totalEmployees, numberOfPages });
    }
    else {
        completeEmployee = await employees.select('-password').select('-userType');
        res.status(200).json({ completeEmployee });
    }

};

const getIndividualEmployeeDetails = async (req, res) => {
    const id = req.params.id;

    const individualEmployee = await employee.findById({ _id: id }).select('-password').select('-userType');

    if (individualEmployee) {
        res.status(200).json({ individualEmployee });
    }
    else {
        throw new badRequestError(`No Employee with id ${id}`);
    }
};

const getEmployeeByTeam = async (req, res) => {
    const { email } = req.user;
    console.log(email)
    const currentEmployee = await employee.findOne({ email: email }).select('-password');

    if (currentEmployee) {
        let currentEmployeeTeam = currentEmployee.team;
        const teamEmployee = await employee.find({ team: currentEmployeeTeam }).select('-password').select('-userType');

        if (teamEmployee) {
            res.status(200).json({ teamEmployee });
        }
    }
    else {
        throw new customAPIError("Current employee don't have any team");
    }
}

const deleteIndividualEmployeeDetails = async (req, res) => {
    const id = req.params.id;

    const deleteEmployee = await employee.findByIdAndRemove({ _id: id }).select('-userType');

    if (deleteEmployee) {
        res.status(200).json({ deleteEmployee, msg: "Employee deleted successfully" });
    }
    else {
        throw new badRequestError(`No Employee with id ${id}`);
    }

};

const giveAdminAccess = async (req, res) => {
    const id = req.params.id;
    if (id) {

        const findEmployee = await employee.findOne({ _id: id, userType: 755 });

        if (!findEmployee) {

            const individualEmployee = await employee.findByIdAndUpdate({ _id: id },
                { userType: 755 },
                { new: true, runValidators: true }
            ).select('-password').select('-userType');

            if (individualEmployee) {
                res.status(200).json({ individualEmployee, msg: "Access Given Successfully" });
            }
        } else {
            const individualEmployee = await employee.findByIdAndUpdate({ _id: id },
                { userType: 255 },
                { new: true, runValidators: true }
            ).select('-password').select('-userType');

            if (individualEmployee) {
                res.status(200).json({ individualEmployee, msg: "Access Revoked Successfully" });
            }
        }

    }
    else {
        throw new badRequestError("Please provide Employee ID");
    }
};

const updateIndividualEmployeeDetail = async (req, res) => {
    const id = req.params.id;

    const { name, dob, address, designation, team, seat, reportingTo, email, joiningDate, preferenceStartTime, preferenceEndTime, userType } = req.body;

    if (name || dob || address || designation || team || seat || reportingTo || email || joiningDate || preferenceStartTime || preferenceEndTime || userType) {
        const individualEmployee = await employee.findByIdAndUpdate({ _id: id },
            { name, dob, address, designation, team, seat, reportingTo, email, joiningDate, preferenceStartTime, preferenceEndTime, userType },
            { new: true, runValidators: true }
        ).select('-password').select('-userType');

        if (individualEmployee) {
            res.status(200).json({ individualEmployee, msg: "Update Successfully" });
        }
        else {
            throw new badRequestError(`No Employee with id ${id}`);
        }
    }
    else {
        throw new badRequestError("Please provide details of employee");
    }
};


module.exports = {
    getEmployeeDetails,
    deleteIndividualEmployeeDetails,
    getIndividualEmployeeDetails,
    updateIndividualEmployeeDetail,
    getEmployeeByTeam,
    giveAdminAccess
}