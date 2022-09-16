const employee = require('../models/employee');
const { badRequestError, unauthenticateError, customAPIError } = require('../errors/')

const loginController = async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    console.log(email, password)
    if (!email || !password) {
        throw new badRequestError('Please provide both username and password');
    }

    const user = await employee.findOne({ email });

    if (user) {
        const comparePass = await user.comparePassword(password);
        if (comparePass) {
            const accessToken = user.createJWT();
            res.status(200).json({
                name: user.name,
                dob: user.dob,
                email: user.email,
                address: user.address,
                designation: user.designation,
                team: user.team,
                seat: user.seat,
                reportingTo: user.reportingTo,
                preferenceEndTime: user.preferenceEndTime,
                preferenceStartTime: user.preferenceStartTime,
                userType: user.userType,
                accessToken,
                msg: "Login successfully"
            });
        }
        else {
            throw new unauthenticateError('Please provide correct credentials')
        }
    }
    else {
        throw new unauthenticateError('User not found')
    }
}

const signupController = async (req, res) => {
    const { name, dob, email, password, address, userType } = req.body;

    const designation = "";
    const team = "";
    const seat = "";
    const reportingTo = "";

    const preferenceStartTime = req.body.preferenceStartTime || "T13:00:00";
    const preferenceEndTime = req.body.preferenceEndTime || "T23:00:00";

    if (!name || !dob || !email || !password || !address) {
        throw new badRequestError("Please provide complete details");;
    }

    const employeeEmail = await employee.findOne({ email }).select('-password');

    if (employeeEmail) {
        throw new customAPIError('User Already Exists');
    }

    const createEmployee = await employee.create({ name, dob, email, password, address, userType, designation, team, seat, reportingTo, preferenceEndTime, preferenceStartTime });
    const accessToken = createEmployee.createJWT();
    res.status(201).json({
        name: createEmployee.name,
        dob: createEmployee.dob,
        email: createEmployee.email,
        address: createEmployee.address,
        designation: createEmployee.designation,
        team: createEmployee.team,
        seat: createEmployee.seat,
        reportingTo: createEmployee.reportingTo,
        preferenceEndTime: createEmployee.preferenceEndTime,
        preferenceStartTime: createEmployee.preferenceStartTime,
        userType: createEmployee.userType,
        accessToken,
        msg: "Employee created successfully"
    });
}

module.exports = {
    loginController,
    signupController
}