const employee = require('../models/employee');
const { badRequestError } = require('../errors/')

const getEmployeeDetails = async (req, res) => {
    const { page } = req.query;

    let limit = 2;
    let skip = (parseInt(page) - 1) * limit;

    const totalEmployees = await employee.countDocuments({});

    const employees = await employee.find({}).select('-password').limit(limit).skip(skip);
    res.status(200).json({ employees, totalPages: Math.ceil((totalEmployees / limit)), currentPage: parseInt(page) });
};

const getIndividualEmployeeDetails = async (req, res) => {
    const id = req.params.id;

    const individualEmployee = await employee.findById({ _id: id }).select('-password');

    if (individualEmployee) {
        res.status(200).json({ individualEmployee });
    }
    else {
        throw new badRequestError(`No Employee with id ${id}`);
    }
};

const deleteIndividualEmployeeDetails = async (req, res) => {
    const id = req.params.id;

    const deleteEmployee = await employee.findByIdAndRemove({ _id: id });

    if (deleteEmployee) {
        res.status(200).json({ deleteEmployee, msg: "Employee deleted successfully" });
    }
    else {
        throw new badRequestError(`No Employee with id ${id}`);
    }

};

const updateIndividualEmployeeDetail = async (req, res) => {
    const id = req.params.id;

    const { name, dob, address, designation, team, seat, reportingTo, email, joiningDate } = req.body;

    if (name || dob || address || designation || team || seat || reportingTo || email || joiningDate) {
        const individualEmployee = await employee.findByIdAndUpdate({ _id: id },
            { name, dob, address, designation, team, seat, reportingTo, email, joiningDate },
            { new: true, runValidators: true }
        ).select('-password');

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
}