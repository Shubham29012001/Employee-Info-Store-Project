import { React, useEffect, useState, useContext } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import "./styles.css"
// Importing All Material UI Icons

import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import HomeIcon from "@mui/icons-material/Home";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import BadgeIcon from "@mui/icons-material/Badge";
import PhoneIphoneIcon from "@mui/icons-material/PhoneIphone";

import { useParams, NavLink, useNavigate } from "react-router-dom";
import Grid from "@mui/material/Grid";

// Importing Login Context

import { loginContext } from "../context/contextProvider.js";
import AuthServices from "../../ApiServices/authServices.js";
import { toast } from 'react-toastify';

const Detail = () => {
  const { id } = useParams("");

  const [loginData, setloginData] = useContext(loginContext);

  const userLoginID = loginData._id;

  const history = useNavigate("");
  const [getUserData, setUserData] = useState([]);
  const [getID, setID] = useState("");

  // Get Individual User Data Details from Backend

  const getEmployeeData = async () => {
    try {
      const { data: res } = await AuthServices.getEmployee(id);
      if (res) {
        res.individualEmployee.dob = res.individualEmployee.dob.split('T')[0]
        res.individualEmployee.joiningDate = res.individualEmployee.joiningDate.split('.')[0];
        setUserData(res.individualEmployee);
      }
    }
    catch (error) {
      console.log(error.response.data.msg);
    }
  };


  useEffect(() => {
    getEmployeeData();
    setID(userLoginID);
  }, []);

  // Delete User Details in Backend from Detail Page Icon

  const deleteEmployeeData = async (id) => {
    try {
      const { data: res } = await AuthServices.deleteEmployee(id);
      if (res) {
        toast.success('Employee Deleted Successfully');
        history("/admin");
      }
    }
    catch (error) {
      toast.error(error.response.data.msg);
    }
  };

  // Return the User Details if ID gets Matched with loginContext ID value else Show Unauthorized Access

  if (getID === id || loginData.userType === 755) {
    return (
      <div className="container mt-3">
        <h1 style={{ fontWeight: 400, textAlign: "center" }}>
          Welcome {JSON.parse(localStorage.getItem("userDetails")).name}
        </h1>
        <Grid
          container
          spacing={0}
          direction="column"
          alignItems="center"
          justify="center"
          style={{ minHeight: "100vh" }}
        >
          <Grid item xs={3}>
            <Card sx={{ minWidth: 275, maxWidth: 700 }}>
              <CardContent>
                <div className="row">
                  <div className="right_view col-12 col-lg-12 col-md-12">
                    {loginData.userType === 755 && (
                      <div className="add_btn">
                        <NavLink to={`/admin/edit/${getUserData._id}`}>
                          <button className="btn btn-primary mx-2">
                            <EditIcon />
                          </button>
                        </NavLink>
                        <button
                          className="btn btn-danger mx-2"
                          onClick={() => deleteEmployeeData(getUserData._id)}
                        >
                          <DeleteIcon />
                        </button>
                      </div>
                    )}
                    <h3>
                      <BadgeIcon /> Full Name:{" "}
                      <span>{getUserData.name}</span>
                    </h3>
                    <h3>
                      <MailOutlineIcon /> Email:{" "}
                      <span>{getUserData.email}</span>
                    </h3>
                    <h3>
                      <MailOutlineIcon /> Date Of Birth:{" "}
                      <span>{getUserData.dob}</span>
                    </h3>
                    <h3>
                      <HomeIcon /> Home Address:{" "}
                      <span>{getUserData.address}</span>
                    </h3>
                    <h3>
                      <PhoneIphoneIcon /> Designation:{" "}
                      <span>{getUserData.designation}</span>
                    </h3>
                    <h3>
                      <CreditCardIcon /> Reporting To:{" "}
                      <span>{getUserData.reportingTo}</span>
                    </h3>
                    <h3>
                      <CreditCardIcon /> Team:{" "}
                      <span>{getUserData.team}</span>
                    </h3>
                    <h3>
                      <CreditCardIcon /> Seat No:{" "}
                      <span>{getUserData.seat}</span>
                    </h3>
                    <h3>
                      <CreditCardIcon /> Joining Date:{" "}
                      <span>{getUserData.joiningDate}</span>
                    </h3>
                    <h3>
                      <CreditCardIcon /> Preference Time:{" "}
                      <span>{getUserData.preferenceStartTime + " - " + getUserData.preferenceEndTime}</span>
                    </h3>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </div>

    );
  } else {
    return <h1>Unauthorized Access</h1>;
  }
};

export default Detail;