const employee = require('../models/employee');
const { badRequestError, unauthenticateError, customAPIError } = require('../errors/')

const loginController = async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    if (!email || !password) {
        throw new badRequestError('Please provide both username and password');
    }

    const user = await employee.findOne({ email });
    const comparePass = await user.comparePassword(password);

    if (comparePass) {
        const accessToken = user.createJWT();
        res.status(200).json({ accessToken, msg: "Login successfully" });
    }
    else {
        throw new unauthenticateError('Please provide correct credentials')
    }
}

const signupController = async (req, res) => {
    const name = req.body.name;
    const dob = req.body.dob;
    const email = req.body.email;
    const password = req.body.password;
    const address = req.body.address;
    const userType = 100;
    const designation = "";
    const team = "";
    const seat = "";
    const reportingTo = "";

    if (!name || !dob || !email || !password || !address) {
        throw new badRequestError("Please provide complete details");;
    }

    const employeeEmail = await employee.findOne({ email }).select('-password');

    if (employeeEmail) {
        throw new customAPIError('User Already Exists');
    }

    const createEmployee = await employee.create({ name, dob, email, password, address, userType, designation, team, seat, reportingTo });
    const accessToken = createEmployee.createJWT();
    res.status(201).json({ createEmployee, accessToken, msg: "Employee created successfully" });
}

module.exports = {
    loginController,
    signupController
}