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

import {
  addUserDataContext,
  updateUserDataContext,
  deleteUserDataContext,
  loginContext
} from '../context/contextProvider.js';

import BadgeIcon from '@mui/icons-material/Badge';
import { toast } from 'react-toastify';

import AuthServices from '../../ApiServices/authServices.js';

const Admin = () => {
  const [loading, setLoading] = useState(false);
  const [row, setRow] = useState([]);
  // Using Context Values

  // const [userData, setuserData] = useContext(addUserDataContext);
  // const [updateUserData, setupdateUserData] = useContext(updateUserDataContext);
  const [deleteUserData, setdeleteUserData] = useContext(deleteUserDataContext);
  const [loginData, setloginData] = useContext(loginContext);

  const columns = loginData.userType === 755 ? [
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
                <NavLink to={`/view/${data._id}`}>
                  {' '}
                  <Tooltip title="View Employee">
                    <IconButton>
                      <RemoveRedEyeIcon className="logo abort" />
                    </IconButton>
                  </Tooltip>
                </NavLink>
                <Tooltip title="Edit Employee">
                  <IconButton>
                    <NavLink to={`/admin/edit/${data._id}`}>
                      <EditIcon className="logo edit " />
                    </NavLink>
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


  const getEmployeesData = async () => {
    try {
      if (loginData.userType === 755) {
        const { data: res } = await AuthServices.getEmployees();
        if (res) {
          setRow(res.completeEmployee);
        }
      }
      else {
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

  useEffect(() => {
    getEmployeesData();
  }, []);  // // Delete Users in Backend

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

              <GridTable columns={columns} rows={row} pageSize={8} />

            </>
          )
          }


        </div>
      </div>
    </>
  );
};

export default Admin;
