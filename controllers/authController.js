const employee = require('../models/employee');
const { badRequestError } = require('../errors/')

const loginController = async (req, res) => {
    res.status(200).send("loginController Route and Controller");
}

const signupController = async (req, res) => {
    const name = req.body.name;
    const dob = req.body.dob;
    const email = req.body.email;
    const password = req.body.password;
    const address = req.body.address;

    if (!name || !dob || !email || !password || !address) {
        throw new badRequestError("Please provide complete details");;
    }

    const createEmployee = await employee.create({ name, dob, email, password, address });
    res.status(201).json({ createEmployee, msg: "Employee created successfully" });
}

module.exports = {
    loginController,
    signupController
}