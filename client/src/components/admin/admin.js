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
import SaveIcon from '@mui/icons-material/Save';
import moment from 'moment';
import _ from "lodash";

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
  const [pageNumber, setPageNumber] = useState(1);
  const [numberOfPages, setNumberOfPages] = useState(0);
  const [total, setTotal] = useState(0);
  const pages = new Array(numberOfPages).fill(null).map((v, i) => i);

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
              {moment(value).format("DD/MM/YYYY, hh:mm A")}
            </div>
          </div>
        )
      }
    },
    {
      id: 8,
      field: "actions",
      label: "Actions",
      cellRenderer: ({ tableManager, value, field, data, column, colIndex, rowIndex }) => {
        return (
          <>
            <div data-row-id={rowIndex} data-row-index={rowIndex} data-column-id={colIndex} className={`rgt-cell rgt-row-${rowIndex} rgt-row-odd rgt-cell-name`} >
              <div className={`rgt-cell-inner rgt-text-truncate`} title={`${rowIndex}`} >
                {loginData.userType === 955 && <Tooltip title="Give Access">
                  <IconButton onClick={() => giveAdminAccess(data._id, data.userType)} >
                    <AdminPanelSettingsIcon className={`logo ${data.userType === 755 && 'access'}`} />
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
                  <IconButton onClick={() => deleteEmployeeData(data._id, data.userType)} >
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
              {moment(value).format("DD/MM/YYYY, hh:mm A")}
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

  const [form, setForm] = useState({
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


  const getEmployeesData = async (e) => {
    try {
      if (loginData.userType === 755 || loginData.userType === 955) {
        const { data: res } = await AuthServices.getEmployees(pageNumber, form);
        if (res) {
          setRow(res.completeEmployee);
          setNumberOfPages(res.numberOfPages)
          setTotal(res.totalEmployees);
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
      localStorage.removeItem('userDetails');
      setLoading(false)
      setRow([])
    }
  }

  const handleChange = ({ currentTarget: input }) => {
    setForm({ ...form, [input.name]: input.value });
  };

  const checkboxChange = ({ currentTarget }) => {
    setForm({ ...form, [currentTarget.name]: !currentTarget.checked });
  };

  const handleDataChange = ({ currentTarget: input }) => {
    setData({ ...data, [input.name]: input.value });
  };

  const getEmployeeData = async (id) => {
    try {
      const { data: res } = await AuthServices.getEmployee(id);
      if (res) {
        res.individualEmployee.dob = moment(res.individualEmployee.dob).format("YYYY-MM-DD");
        res.individualEmployee.joiningDate = moment(res.individualEmployee.joiningDate).format("YYYY-MM-DDTHH:mm");
        setUserData(res.individualEmployee);
        setData(res.individualEmployee);
      }
    }
    catch (error) {
      console(error.response.data.msg);
      setloginData(null);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data: res } = await AuthServices.updateEmployee(data._id, data);
      if (res) {
        setPageNumber(pageNumber)
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
  }, [pageNumber, form]);  // // Delete Users in Backend

  const giveAdminAccess = async (id, userType) => {
    try {
      if (userType === 955) {
        toast.error("Cannot Change Super Admin Access");
      }
      else {
        const swalFire = await Swal.fire({
          title: 'Are you sure?',
          text: "You are giving access to an user",
          icon: 'warning',
          showCancelButton: true,
          confirmButtonColor: '#d33',
          cancelButtonColor: '#3085d6',
          confirmButtonText: 'Yes, give access!'
        })

        if (swalFire.isConfirmed) {
          const { data: res } = await AuthServices.giveAdminAccess(id);
          if (res) {
            setPageNumber(pageNumber)
            getEmployeesData();
            toast.success(res.msg)
          }
        }

      }
    }
    catch (error) {
      toast.error(error.response.data.msg);
    }
  }

  const deleteEmployeeData = async (id, userType) => {
    try {
      if (userType === 955) {
        toast.error("Cannot Delete Super Admin");
      }
      else {
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
            setPageNumber(pageNumber)
            handleClose();
            getEmployeesData();
            setdeleteUserData(deleteUserData);
            toast.success("Employee Deleted Succesfully")
          }
        }
      }

    }
    catch (error) {
      toast.error(error.response.data.msg);
    }
  }


  const Pagination = ({
    tableManager,
    onChange = tableManager.paginationApi.setPage,
  }) => {
    const {
      config: {
        texts: {
          prev: prevText,
          page: pageText,
          next: nextText,
          of: ofText,
        },
        additionalProps: { pagination: additionalProps = {} },
      },
      paginationApi: { totalPages },
    } = tableManager;

    let backButtonDisabled = pageNumber - 1 < 1;
    let nextButtonDisabled = pageNumber + 1 > numberOfPages;

    let classNames = (
      "rgt-footer-pagination " + (additionalProps.className || "")
    ).trim();

    return (
      <div {...additionalProps} className={classNames}>
        <button
          className={`rgt-footer-pagination-button${backButtonDisabled ? " rgt-disabled-button" : ""
            }`}
          disabled={pageNumber < 1}
          onClick={() => {
            setPageNumber(Math.max(0, pageNumber - 1));
          }}
        >
          {prevText}
        </button>

        <div className="rgt-footer-pagination-input-container">
          <span>{pageText} </span>
          <input
            onClick={(event) => event.target.select()}
            className="rgt-footer-page-input"
            type="number"
            value={numberOfPages ? Math.max(pageNumber, 1) : 0}
            onChange={(event) => onChange(event.target.value * 1)}
          />
          <span>
            {ofText} {numberOfPages}
          </span>
        </div>

        <button
          className={`rgt-footer-pagination-button${nextButtonDisabled ? " rgt-disabled-button" : ""
            }`}
          disabled={pageNumber + 1 > numberOfPages}
          onClick={() => {
            setPageNumber(Math.max(pageNumber + 1, numberOfPages));
          }}
        >
          {nextText}
        </button>
      </div >
    );
  };


  const Information = ({
    tableManager,
    pageSize = tableManager.paginationApi.pageSize,
    pageCount = tableManager.paginationApi.pageRows.length,
  }) => {
    const {
      config: {
        isPaginated,
        texts: {
          totalRows: totalRowsText,
          rows: rowsText,
        },
        additionalProps: { information: additionalProps = {} },
      },
      paginationApi: { page },
    } = tableManager;

    let classNames = (
      "rgt-footer-items-information " + (additionalProps.className || "")
    ).trim();

    return (
      <div {...additionalProps} className={classNames}>
        {totalRowsText} {total || 0}&nbsp;
        {!isPaginated
          ? ""
          : `| ${rowsText} ${!pageCount
            ? "0"
            : `${pageSize * (page - 1) + 1} - ${pageSize * (page - 1) + pageCount
            }`
          }`}{" "}
      </div>
    );
  };

  return (
    <>

      <div className="mt-3">
        <div className="container">
          {loading === false ? (<Loader />) : (
            <>
              {(loginData.userType === 755 || loginData.userType === 955) &&
                <form onSubmit={getEmployeesData}>
                  <div className="input_container">
                    <div className="admin_input">
                      <label htmlFor="designation">Designation: </label>
                      <input type="text" value={form.designation} onChange={handleChange}

                        name="designation" />
                    </div>
                    <div className="admin_input">
                      <label htmlFor="team">Team: </label>
                      <input type="text" value={form.team} onChange={handleChange}

                        name="team" />
                    </div>
                    <div className="admin_input">
                      <label htmlFor="reporting">Reporting To: </label>
                      <input type="text" value={form.reportingTo} onChange={handleChange}

                        name="reporting" />
                    </div>
                    <div className="admin_input">
                      <label htmlFor="joiningDate">Sort: </label>
                      <input type="checkbox" defaultChecked={form.joiningDate} onChange={checkboxChange}
                        name="joiningDate" />
                    </div>
                  </div>
                </form>
              }

              <GridTable className="gridtable" columns={columns} rows={row} pageSize={7} requestDebounceTimeout={500} components={{ Pagination, Information }} />

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
                        <BadgeIcon className="inner" /><span><b>Full Name:{" "}</b>
                          {getUserData.name}</span>
                      </h3>
                      <h3>
                        <MailOutlineIcon className="inner" /><span><b>Email:{" "}</b>
                          {getUserData.email}</span>
                      </h3>
                      <h3>
                        <DateRangeIcon className="inner" /><span><b>Date Of Birth:{" "}</b>
                          {getUserData.dob}</span>
                      </h3>
                      <h3>
                        <HomeIcon className="inner" /><span><b>Home Address:{" "}</b>
                          {getUserData.address}</span>
                      </h3>
                      <h3>
                        <PhoneIphoneIcon className="inner" /><span><b>Designation:{" "}</b>
                          {getUserData.designation}</span>
                      </h3>
                      <h3>
                        <CreditCardIcon className="inner" /><span><b>Reporting To:{" "}</b>
                          {getUserData.reportingTo}</span>
                      </h3>
                      <h3>
                        <GroupWorkIcon className="inner" /><span><b>Team:{" "}</b>
                          {getUserData.team}</span>
                      </h3>
                      <h3>
                        <MailOutlineIcon className="inner" /><span><b>Seat No:{" "}</b>
                          {getUserData.seat}</span>
                      </h3>
                      <h3>
                        <DateRangeIcon className="inner" /><span><b>Joining Date:{" "}</b>
                          {new Date(getUserData.joiningDate).toLocaleString('en-GB', { timeZone: 'UTC' })}</span>
                      </h3>
                      <h3>
                        <CreditCardIcon className="inner" /><span><b>Preference Time:{" "}</b>
                          {getUserData.preferenceStartTime + " - " + getUserData.preferenceEndTime}</span>
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
                          onChange={handleDataChange}
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
                          onChange={handleDataChange}
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
                          onChange={handleDataChange}
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
                          onChange={handleDataChange}
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
                          onChange={handleDataChange}
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
                          onChange={handleDataChange}
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
                          onChange={handleDataChange}
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
                          onChange={handleDataChange}
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
                          onChange={handleDataChange}
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
                          onChange={handleDataChange}
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
                          onChange={handleDataChange}
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
                    Edit <SaveIcon />
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
