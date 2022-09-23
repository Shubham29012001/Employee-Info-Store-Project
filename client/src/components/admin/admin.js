import React, { useState, useEffect, useContext } from 'react';
import { NavLink } from 'react-router-dom';
import "./admin.css";
import Swal from 'sweetalert2';
import Loader from '../loader/loader';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { Tooltip, IconButton } from '@mui/material';
import GridTable from "@nadavshaar/react-grid-table";
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import MailOutlineIcon from "@mui/icons-material/MailOutline";
import HomeIcon from "@mui/icons-material/Home";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import BadgeIcon from "@mui/icons-material/Badge";
import PhoneIphoneIcon from "@mui/icons-material/PhoneIphone";
import DateRangeIcon from '@mui/icons-material/DateRange';
import GroupWorkIcon from '@mui/icons-material/GroupWork';
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';

import {
  addUserDataContext,
  updateUserDataContext,
  deleteUserDataContext,
  loginContext
} from '../context/contextProvider.js';

import { toast } from 'react-toastify';

import AuthServices from '../../ApiServices/authServices.js';

const Admin = () => {
  const [loading, setLoading] = useState(false);
  const [row, setRow] = useState([]);

  const [show, setShow] = useState(false);
  const [editShow, seteditShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleEditClose = () => seteditShow(false);
  const handleEditShow = () => seteditShow(true);

  const [deleteUserData, setdeleteUserData] = useContext(deleteUserDataContext);
  const [loginData, setloginData] = useContext(loginContext);
  const [updateUserData, setupdateUserData] = useContext(updateUserDataContext);

  const [getUserData, setUserData] = useState([]);
  const [getID, setID] = useState("");
  const userLoginID = loginData._id;

  const columns = loginData.userType === 755 || loginData.userType === 955 ? [
    {
      id: 1,
      field: "id",
      label: "ID",
      cellRenderer: ({ tableManager, value, field, data, column, colIndex, rowIndex }) => {
        return (
          <div data-row-id={rowIndex} data-row-index={rowIndex} data-column-id={colIndex} className={`rgt-cell rgt-row-${rowIndex} rgt-row-odd rgt-cell-name`} > <div className={`rgt-cell-inner rgt-text-truncate`} title={`${rowIndex}`} > {rowIndex}</div ></div >
        )
      },
      width: "60px"
    },
    {
      id: 2,
      field: "name",
      label: "Name"
    },
    {
      id: 3,
      field: "email",
      label: "Email",
      maxWidth: "100%"
    },
    {
      id: 4,
      field: "designation",
      label: "Designation ",
    },
    {
      id: 5,
      field: "reportingTo",
      label: "Reporting To ",

    },
    {
      id: 6,
      field: "joiningDate",
      label: "Joining Date ",
      cellRenderer: ({ tableManager, value, field, data, column, colIndex, rowIndex }) => {
        return (
          <div data-row-id={rowIndex} data-row-index={rowIndex} data-column-id={colIndex} className={`rgt-cell rgt-row-${rowIndex} rgt-row-odd rgt-cell-name`} >
            <div className={`rgt-cell-inner rgt-text-truncate`} title={`${rowIndex}`} >
              {new Date(value).toLocaleString('en-GB', { timeZone: 'IST' })}
            </div>
          </div>
        )
      }
    },
    {
      id: 7,
      field: "actions",
      label: "Actions",
      cellRenderer: ({ tableManager, value, field, data, column, colIndex, rowIndex }) => {
        return (
          <>
            <div data-row-id={rowIndex} data-row-index={rowIndex} data-column-id={colIndex} className={`rgt-cell rgt-row-${rowIndex} rgt-row-odd rgt-cell-name`} >
              <div className={`rgt-cell-inner rgt-text-truncate`} title={`${rowIndex}`} >
                {loginData.userType === 955 && <Tooltip title="Give Access">
                  <IconButton onClick={() => giveAdminAccess(data._id)} >
                    <AdminPanelSettingsIcon className="logo" />
                  </IconButton>
                </Tooltip>}

                <Tooltip title="View Employee">
                  <IconButton onClick={() => { handleShow(); getEmployeeData(data._id); }}>
                    <RemoveRedEyeIcon className="logo abort" />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Edit Employee">
                  <IconButton onClick={() => { handleEditShow(); getEmployeeData(data._id); }}>
                    <EditIcon className="logo edit" />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Delete Employee">
                  <IconButton onClick={() => deleteEmployeeData(data._id)} >
                    <DeleteIcon className="logo delete" />
                  </IconButton>
                </Tooltip>
              </div >
            </div >

          </>

        )
      }
    },
  ] : [
    {
      id: 1,
      field: "id",
      label: "ID",
      cellRenderer: ({ tableManager, value, field, data, column, colIndex, rowIndex }) => {
        return (
          <div data-row-id={rowIndex} data-row-index={rowIndex} data-column-id={colIndex} className={`rgt-cell rgt-row-${rowIndex} rgt-row-odd rgt-cell-name`} > <div className={`rgt-cell-inner rgt-text-truncate`} title={`${rowIndex}`} > {rowIndex}</div ></div >
        )
      },
      width: "60px"
    },
    {
      id: 2,
      field: "name",
      label: "Name"
    },
    {
      id: 3,
      field: "email",
      label: "Email",
      maxWidth: "100%"
    },
    {
      id: 4,
      field: "designation",
      label: "Designation ",
    },
    {
      id: 5,
      field: "reportingTo",
      label: "Reporting To ",
    },
    {
      id: 6,
      field: "team",
      label: "Team",
    },
    {
      id: 7,
      field: "joiningDate",
      label: "Joining Date ",
      cellRenderer: ({ tableManager, value, field, data, column, colIndex, rowIndex }) => {
        return (
          <div data-row-id={rowIndex} data-row-index={rowIndex} data-column-id={colIndex} className={`rgt-cell rgt-row-${rowIndex} rgt-row-odd rgt-cell-name`} >
            <div className={`rgt-cell-inner rgt-text-truncate`} title={`${rowIndex}`} >
              {new Date(value).toLocaleString('en-GB', { timeZone: 'IST' })}
            </div>
          </div>
        )
      }
    },
  ];

  const [data, setData] = useState({
    _id: "",
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

  const getEmployeesData = async () => {
    try {
      if (loginData.userType === 755 || loginData.userType === 955) {
        const { data: res } = await AuthServices.getEmployees();
        if (res) {
          setRow(res.completeEmployee);
        }
      }
      else if (loginData.userType === 255) {
        const { data: res } = await AuthServices.getEmployeesByTeam(loginData.email);
        if (res) {
          setRow(res.teamEmployee);
        }
      }
      setLoading(true)
    }
    catch (error) {
      console.log(error.response.data.msg);
      setloginData(null)
      setLoading(false)
      setRow([])
    }
  }

  const getEmployeeData = async (id) => {
    try {
      const { data: res } = await AuthServices.getEmployee(id);
      if (res) {
        console.log(res)
        res.individualEmployee.dob = res.individualEmployee.dob.split('T')[0]
        res.individualEmployee.joiningDate = res.individualEmployee.joiningDate.split('.')[0];
        setUserData(res.individualEmployee);
        setData(res.individualEmployee);
      }
    }
    catch (error) {
      console.log(error.response.data.msg);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data: res } = await AuthServices.updateEmployee(data._id, data);
      if (res) {
        handleEditClose();
        handleClose();
        getEmployeesData();
        setData('');
        toast.success('Employee Updated Successfully');
        setupdateUserData(res);
      }
    }
    catch (error) {
      toast.error(error.response.data.msg);
    }
  };

  useEffect(() => {
    getEmployeesData();
  }, []);  // // Delete Users in Backend

  const giveAdminAccess = async (id) => {
    try {
      const swalFire = await Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Yes, give access!'
      })

      if (swalFire.isConfirmed) {
        const { data: res } = await AuthServices.giveAdminAccess(id);
        if (res) {
          getEmployeesData();
          toast.success(res.msg)
        }
      }

    }
    catch (error) {
      console.log(error)
      toast.error(error.response.data.msg);
    }
  }

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
          handleClose();
          getEmployeesData();
          setdeleteUserData(deleteUserData);
          toast.success("Employee Deleted Succesfully")
        }
      }

    }
    catch (error) {
      toast.error(error.response.data.msg);
    }
  }


  return (
    <>

      <div className="mt-3">
        <div className="container">
          {loading === false ? (<Loader />) : (
            <>
              <h1>
                <BadgeIcon /> Employees
              </h1>
              <GridTable columns={columns} rows={row} pageSize={8} requestDebounceTimeout={500} />

              <Modal show={show} onHide={handleClose} centered>
                <Modal.Body>
                  <div className="row">
                    <div className="right_view col-12 col-lg-12 col-md-12">
                      {(loginData.userType === 755 || loginData.userType === 955) && (
                        <div className="add_btn">
                          <Tooltip title="Edit Employee">

                            <IconButton className="editdetail logodetail" onClick={() => { handleEditShow(); getEmployeeData(data._id); }}>
                              <EditIcon className="editdetail" />
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
                </Modal.Body>
              </Modal>

              <Modal size="lg" show={editShow} onHide={handleEditClose} centered>
                <Modal.Header closeButton>
                  <Modal.Title className="w-100 text-center">Edit Employees</Modal.Title>
                </Modal.Header>
                <Modal.Body >
                  <form>
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
                    </div>
                  </form>
                </Modal.Body>
                <Modal.Footer>
                  <Button variant="secondary" onClick={handleEditClose}>
                    Close
                  </Button>
                  <Button variant="primary" onClick={handleEditSubmit}>
                    Edit
                  </Button>
                </Modal.Footer>
              </Modal>
            </>
          )
          }
        </div>
      </div>
    </>
  );
};

export default Admin;
