import { React, useEffect, useState, useContext } from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import "./styles.css"

// Importing All Material UI Icons

import Swal from 'sweetalert2'
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import HomeIcon from "@mui/icons-material/Home";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import BadgeIcon from "@mui/icons-material/Badge";
import PhoneIphoneIcon from "@mui/icons-material/PhoneIphone";
import DateRangeIcon from '@mui/icons-material/DateRange';
import GroupWorkIcon from '@mui/icons-material/GroupWork';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';
import { Tooltip, IconButton } from "@mui/material";
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
      const swalFire = await Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,

        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Yes, delete it!'
      })

      if (swalFire.isConfirmed) {

        const { data: res } = await AuthServices.deleteEmployee(id);
        if (res) {
          toast.success('Employee Deleted Successfully');
          history("/admin");
          Swal.fire(
            'Deleted!',
            'Employee has been deleted.',
            'success'
          )
        }
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
          <KeyboardBackspaceIcon style={{ fontSize: "40px", cursor: "pointer" }} onClick={() => {
            history('/admin');
          }} /> Welcome {JSON.parse(localStorage.getItem("userDetails")).name}
        </h1>
        <Grid
          container
          spacing={0}
          direction="column"
          alignItems="center"
          justify="center"
          style={{
            minHeight: "100vh", boxShadow: "0px 3px 3px - 2px rgb(0 0 0 / 20 %), 0px 3px 4px 0px rgb(0 0 0 / 14 %), 0px 1px 8px 0px rgb(0 0 0 / 12%)"
          }}
        >
          <Grid item xs={3}>
            <Card className="card" sx={{ minWidth: 275, maxWidth: 700, borderRadius: "25px" }}>
              <CardContent>
                <div className="row">
                  <div className="right_view col-12 col-lg-12 col-md-12">
                    {loginData.userType === 755 && (
                      <div className="add_btn">
                        <Tooltip title="Edit Employee">
                          <IconButton className=" editdetail logodetail">
                            <NavLink to={`/admin/edit/${getUserData._id}`}>
                              <EditIcon className="editdetail " />
                            </NavLink>
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete Employee">
                          <IconButton className=" deletedetail logodetail">
                            <DeleteIcon className="deletedetail " onClick={() => deleteEmployeeData(getUserData._id)}
                            />
                          </IconButton>
                        </Tooltip>
                      </div>
                    )}
                    <h3>
                      <BadgeIcon className="inner" /> Full Name:{" "}
                      <span>{getUserData.name}</span>
                    </h3>
                    <h3>
                      <MailOutlineIcon className="inner" /> Email:{" "}
                      <span>{getUserData.email}</span>
                    </h3>
                    <h3>
                      <DateRangeIcon className="inner" /> Date Of Birth:{" "}
                      <span>{getUserData.dob}</span>
                    </h3>
                    <h3>
                      <HomeIcon className="inner" /> Home Address:{" "}
                      <span>{getUserData.address}</span>
                    </h3>
                    <h3>
                      <PhoneIphoneIcon className="inner" /> Designation:{" "}
                      <span>{getUserData.designation}</span>
                    </h3>
                    <h3>
                      <CreditCardIcon className="inner" /> Reporting To:{" "}
                      <span>{getUserData.reportingTo}</span>
                    </h3>
                    <h3>
                      <GroupWorkIcon className="inner" /> Team:{" "}
                      <span>{getUserData.team}</span>
                    </h3>
                    <h3>
                      <MailOutlineIcon className="inner" /> Seat No:{" "}
                      <span>{getUserData.seat}</span>
                    </h3>
                    <h3>
                      <DateRangeIcon className="inner" /> Joining Date:{" "}
                      <span>{new Date(getUserData.joiningDate).toLocaleString('en-GB', { timeZone: 'UTC' })}</span>
                    </h3>
                    <h3>
                      <CreditCardIcon className="inner" /> Preference Time:{" "}
                      <span>{getUserData.preferenceStartTime + " - " + getUserData.preferenceEndTime}</span>
                    </h3>
                  </div>
                </div>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </div >

    );
  } else {
    return <h1>Unauthorized Access</h1>;
  }
};

export default Detail;