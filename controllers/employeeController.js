const employee = require('../models/employee');

const getEmployeeDetails = async (req, res) => {
    const employees = await employee.find({});

    res.status(200).json({ employees });
};

const getIndividualEmployeeDetails = async (req, res) => {
    const id = req.params.id;

    const individualEmployee = await employee.findById({ _id: id });

    individualEmployee ?
        res.status(200).json({ individualEmployee }) :
        res.status(400).json({ msg: `No Employee with id ${id}` })
};

const deleteIndividualEmployeeDetails = async (req, res) => {
    const id = req.params.id;

    const deleteEmployee = await employee.findByIdAndRemove({ _id: id });

    deleteEmployee ?
        res.status(200).json({ deleteEmployee, msg: "Employee deleted successfully" }) :
        res.status(400).json({ msg: `No Employee with id ${id}` })
};


const updateIndividualEmployeeDetail = async (req, res) => {
    const id = req.params.id;

    const { name, dob, address, designation, team, seat, reportingTo, email } = req.body;

    if (!name || !dob || !address || !designation || !team || !seat || !reportingTo || !email) {
        res.status(400).json({ msg: "Please provide details of employee" });
    }
    else {
        const individualEmployee = await employee.findByIdAndUpdate({ _id: id },
            { name: name, dob: dob, address: address, designation: designation, team: team, seat: seat, reportingTo: reportingTo, email: email },
            { new: true, runValidators: true }
        );

        individualEmployee ?
            res.status(200).json({ individualEmployee, msg: "Update Successfully" }) :
            res.status(400).json({ msg: `No employee with id ${id}` });
    }
};

module.exports = {
    getEmployeeDetails,
    deleteIndividualEmployeeDetails,
    getIndividualEmployeeDetails,
    updateIndividualEmployeeDetail,
}