import React, { useState, useEffect, useContext } from 'react';
import { NavLink } from 'react-router-dom';
import "./admin.css";
import Swal from 'sweetalert2';
import Loader from '../loader/loader';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import {
  addUserDataContext,
  updateUserDataContext,
  deleteUserDataContext,
  loginContext
} from '../context/contextProvider.js';

import BadgeIcon from '@mui/icons-material/Badge';
import { toast } from 'react-toastify';

import AuthServices from '../../ApiServices/authServices.js';
import _ from 'lodash';

const Admin = () => {
  const [pageNumber, setPageNumber] = useState(1);
  const [getEmployees, setEmployees] = useState([]);
  const [numberOfPages, setNumberOfPages] = useState(0);
  const [loading, setLoading] = useState(false);
  // Using Context Values

  // const [userData, setuserData] = useContext(addUserDataContext);
  // const [updateUserData, setupdateUserData] = useContext(updateUserDataContext);
  const [deleteUserData, setdeleteUserData] = useContext(deleteUserDataContext);
  const [loginData, setloginData] = useContext(loginContext);
  const pages = new Array(numberOfPages).fill(null).map((v, i) => i);
  const [data, setData] = useState({
    designation: "",
    team: "",
    reporting: "",
    joiningDate: false
  });

  const getEmployeesData = async (e) => {
    try {
      if (loginData.userType === 755) {
        const { data: res } = await AuthServices.getEmployees(pageNumber, data);
        if (res) {
          setEmployees(res.completeEmployee);
          setNumberOfPages(res.numberOfPages)
        }
      }
      else {
        const { data: res } = await AuthServices.getEmployeesByTeam(loginData.email);
        if (res) {
          setEmployees(res.teamEmployee);
        }
      }
      setLoading(true)
    }
    catch (error) {
      console.log(error.response.data.msg);
      setloginData(null)
    }
  }

  const handleChange = ({ currentTarget }) => {
    setData({ ...data, [currentTarget.name]: currentTarget.value });
    getEmployeesData()
  };

  const checkboxChange = ({ currentTarget: input }) => {
    setData({ ...data, [input.name]: !input.value.checked });
  };

  const delay = _.debounce(() => {
    getEmployeesData();
  }, 500);

  useEffect(() => {
    delay();
  }, [pageNumber, data]);  // // Delete Users in Backend

  const deleteEmployeeData = async (id) => {
    try {
      const swalFire = await Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!'
      })

      if (swalFire.isConfirmed) {
        const { data: res } = await AuthServices.deleteEmployee(id);
        if (res) {
          Swal.fire(
            'Deleted!',
            'Employee has been deleted.',
            'success'
          )
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

      <div className="mt-5">
        <div className="container">
          {loading === false ? (<Loader />) : (
            <>
              <h1>
                <BadgeIcon /> Employees
              </h1>

              {loginData.userType === 755 &&
                <form onSubmit={getEmployeesData}>
                  <div className="input_container">
                    <div className="admin_input">
                      <label htmlFor="designation">Designation: </label>
                      <input type="text" value={data.designation} onChange={handleChange}

                        name="designation" />
                    </div>
                    <div className="admin_input">
                      <label htmlFor="team">Team: </label>
                      <input type="text" value={data.team} onChange={handleChange}

                        name="team" />
                    </div>
                    <div className="admin_input">
                      <label htmlFor="reporting">Reporting To: </label>
                      <input type="text" value={data.reporting} onChange={handleChange}

                        name="reporting" />
                    </div>
                    <div className="admin_input">
                      <label htmlFor="joiningDate">Sort: </label>
                      <input type="checkbox" value={data.joiningDate} onChange={checkboxChange}
                        name="joiningDate" />
                    </div>
                  </div>
                </form>
              }
              <table className="table mt-5">
                <thead>
                  <tr className="table-dark">
                    <th scope="col">ID</th>
                    <th scope="col">Name</th>
                    <th scope="col">Email</th>
                    <th scope="col">Designation</th>
                    <th scope="col">Reporting To</th>
                    <th scope="col">Team</th>
                    <th scope="col">Joining Date</th>
                    {loginData.userType === 755 && <th scope="col">Actions</th>}
                  </tr>
                </thead>
                <tbody>
                  {getEmployees && getEmployees.length > 0 ? getEmployees.map((element, id) => {
                    return (
                      <tr key={id + 1}>
                        <th scope="row">{id + 1}</th>
                        <td>{element.name}</td>
                        <td>{element.email}</td>
                        <td>{element.designation}</td>
                        <td>{element.reportingTo}</td>
                        <td>{element.team}</td>
                        <td>{new Date(element.joiningDate).toLocaleString('en-GB', { timeZone: 'UTC' })}</td>
                        {loginData.userType === 755 && <td className="d-flex justify-content-between">
                          <NavLink to={`/view/${element._id}`}>
                            {' '}
                            <button className="btn btn-success">
                              <RemoveRedEyeIcon />
                            </button>
                          </NavLink>
                          <NavLink to={`/admin/edit/${element._id}`}>
                            <button className="btn btn-primary">
                              <EditIcon />
                            </button>
                          </NavLink>
                          {loginData.userType !== 755}
                          <button
                            className="btn btn-danger"
                            onClick={() => deleteEmployeeData(element._id)}
                          >
                            <DeleteIcon />
                          </button>
                        </td>}

                      </tr>
                    );
                  }) : <tr><td colspan="8" style={{ textAlign: "center" }}>No Employees</td></tr>}
                </tbody>
              </table>

              {loginData.userType === 755 && <ul className="pagination justify-content-center">
                <li className="page-item">
                  <button className="page-link" onClick={() => {
                    setPageNumber(Math.max(0, pageNumber - 1));
                  }} aria-label="Previous">
                    <span aria-hidden="true">&laquo;</span>
                    <span className="sr-only"></span>
                  </button>
                </li>
                {pages.map((pageIndex) => {
                  return (
                    <li className="page-item" key={pageIndex}>
                      <button className="page-link" onClick={() => { setPageNumber(pageIndex + 1) }}>{pageIndex + 1}</button>
                    </li>
                  )
                })}
                <li className="page-item">
                  <button className="page-link" onClick={() => {
                    setPageNumber(Math.min(numberOfPages, pageNumber + 1))
                  }}
                    aria-label="Next">
                    <span aria-hidden="true">&raquo;</span>
                    <span className="sr-only"></span>
                  </button>
                </li>
              </ul>}

            </>
          )
          }


        </div>
      </div>
    </>
  );
};

export default Admin;
