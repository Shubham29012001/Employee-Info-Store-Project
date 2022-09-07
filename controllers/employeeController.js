const employee = require('../models/employee');
const { badRequestError } = require('../errors/')

const getEmployeeDetails = async (req, res) => {
    const employees = await employee.find({});

    res.status(200).json({ employees });
};

const getIndividualEmployeeDetails = async (req, res) => {
    const id = req.params.id;

    const individualEmployee = await employee.findById({ _id: id });

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
        );

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