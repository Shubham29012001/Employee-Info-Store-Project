import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";

// Importing updateContext Provider

import { updateUserDataContext } from "../context/contextProvider.js";
import AuthServices from "../../ApiServices/authServices.js";
import Zoom from 'react-reveal/Zoom';
import { toast } from 'react-toastify';

const Edit = () => {
  const history = useNavigate("");

  const [updateUserData, setupdateUserData] = useContext(updateUserDataContext);

  const [data, setData] = useState({
    name: "",
    email: "",
    address: "",
    dob: "",
    designation: "",
    reportingTo: "",
    seat: "",
    team: "",
    preferenceStartTime: "",
    preferenceEndTime: "",
    joiningDate: "",
  });

  const handleChange = ({ currentTarget: input }) => {
    setData({ ...data, [input.name]: input.value });
  };

  const { id } = useParams("");
  const getEmployeeData = async () => {
    try {
      const { data: res } = await AuthServices.getEmployee(id);
      if (res) {
        res.individualEmployee.dob = res.individualEmployee.dob.split('T')[0]
        res.individualEmployee.joiningDate = res.individualEmployee.joiningDate.split('.')[0];
        setData(res.individualEmployee);
      }
    }
    catch (error) {
      console.log(error.response.data.msg);
    }
  }
  useEffect(() => {
    getEmployeeData();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!data.name || !data.address || !data.designation || !data.dob || !data.email || !data.joiningDate || !data.preferenceEndTime || !data.preferenceStartTime || !data.reportingTo || !data.team || !data.seat) {
      toast.error("Please provide complete input details");
    }
    else {
      try {
        const { data: res } = await AuthServices.updateEmployee(id, data);
        if (res) {
          toast.success('Employee Updated Successfully');
          setupdateUserData(res);
          history("/admin");
        }
      }
      catch (error) {
        toast.error(error.response.data.msg);
      }
    }
  };

  return (
    <Zoom duration={500}>
      <div className="container mt-3 mb-4">
        <form onSubmit={handleSubmit}>
          <div className="row">
            <div className="mb-3 col-lg-6 col-md-6 col-12">
              <label htmlFor="name" className="form-label">
                Full Name
              </label>
              <input
                type="text"
                className="form-control"
                id="name"
                name="name"
                aria-describedby="nameHelp"
                onChange={handleChange}
                value={data.name}
              />
            </div>
            <div className="mb-3 col-lg-6 col-md-6 col-12">
              <label htmlFor="designation" className="form-label">
                Designation
              </label>
              <input
                type="text"
                className="form-control"
                id="designation"
                name="designation"
                aria-describedby="designationHelp"
                value={data.designation}
                onChange={handleChange}
              />
            </div>
            <div className="mb-3 col-lg-6 col-md-6 col-12">
              <label htmlFor="dob" className="form-label">
                Date of Birth
              </label>
              <input
                type="date"
                className="form-control"
                id="dob"
                aria-describedby="dobHelp"
                name="dob"
                value={data.dob}
                onChange={handleChange}
              />
            </div>
            <div className="mb-3 col-lg-6 col-md-6 col-12">
              <label htmlFor="reportingTo" className="form-label">
                Reporting To
              </label>
              <input
                type="text"
                className="form-control"
                id="reportingTo"
                aria-describedby="reportingToHelp"
                name="reportingTo"
                value={data.reportingTo}
                onChange={handleChange}
              />
            </div>
            <div className="mb-3 col-lg-6 col-md-6 col-12">
              <label htmlFor="email" className="form-label">
                Email Address
              </label>
              <input
                type="email"
                className="form-control"
                id="email"
                aria-describedby="emailHelp"
                name="email"
                value={data.email}
                onChange={handleChange}
              />
            </div>
            <div className="mb-3 col-lg-6 col-md-6 col-12">
              <label htmlFor="seat" className="form-label">
                Employee Seat
              </label>
              <input
                type="text"
                className="form-control"
                id="seat"
                aria-describedby="seatHelp"
                name="seat"
                value={data.seat}
                onChange={handleChange}
              />
            </div>
            <div className="mb-3 col-lg-6 col-md-6 col-12">
              <label htmlFor="team" className="form-label">
                Team
              </label>
              <input
                type="text"
                className="form-control"
                id="team"
                name="team"
                value={data.team}
                onChange={handleChange}
              />

            </div>
            <div className="mb-3 col-lg-6 col-md-6 col-12">
              <label htmlFor="joiningDate" className="form-label">
                Joining Date
              </label>
              <input
                type="datetime-local"
                className="form-control"
                id="joiningDate"
                aria-describedby="joiningDateHelp"
                name="joiningDate"
                value={data.joiningDate}
                onChange={handleChange}
              />
            </div>
            <div className="mb-3">
              <label htmlFor="address" className="form-label">
                Home Address
              </label>
              <textarea
                className="form-control"
                id="address"
                aria-describedby="addressHelp"
                rows={2}
                name="address"
                value={data.address}
                onChange={handleChange}
              />
            </div>
            <div className="mb-3 col-lg-6 col-md-6 col-12">
              <label htmlFor="preferenceStartTime" className="form-label">
                Preference Start Time
              </label>
              <input
                type="text"
                className="form-control"
                id="preferenceStartTime"
                name="preferenceStartTime"
                value={data.preferenceStartTime}
                placeholder="In 24 Hour Format (T10:00)"
                onChange={handleChange}
              />

            </div>
            <div className="mb-3 col-lg-6 col-md-6 col-12">
              <label htmlFor="preferenceEndTime" className="form-label">
                Preference End Time
              </label>
              <input
                type="text"
                className="form-control"
                id="preferenceEndTime"
                aria-describedby="preferenceEndTimeHelp"
                name="preferenceEndTime"
                value={data.preferenceEndTime}
                placeholder="In 24 Hour Format (T18:00)"
                onChange={handleChange}
              />
            </div>
            <button type="submit" className="btn btn-primary mt-3">
              Submit
            </button>
          </div>
        </form>
      </div>
    </Zoom>

  );
};

export default Edit;