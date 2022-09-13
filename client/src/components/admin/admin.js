import React, { useState, useEffect, useContext } from 'react';
import { NavLink } from 'react-router-dom';

import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import {
  addUserDataContext,
  updateUserDataContext,
  deleteUserDataContext,
  loginContext
} from '../context/contextProvider.js';

import AuthServices from '../../ApiServices/authServices.js';

const Admin = () => {
  const [pageNumber, setPageNumber] = useState(1);
  const [getEmployees, setEmployees] = useState([]);
  const [numberOfPages, setNumberOfPages] = useState(0);

  // Using Context Values

  // const [userData, setuserData] = useContext(addUserDataContext);
  // const [updateUserData, setupdateUserData] = useContext(updateUserDataContext);
  const [deleteUserData, setdeleteUserData] = useContext(deleteUserDataContext);
  const [loginData, setloginData] = useContext(loginContext);

  const pages = new Array(numberOfPages).fill(null).map((v, i) => i);

  const getEmployeesData = async (e) => {
    try {
      if (loginData.userType === 755) {
        const { data: res } = await AuthServices.getEmployees(pageNumber);
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
    }
    catch (error) {
      console.log(error.response.data.msg);
    }
  }

  useEffect(() => {
    getEmployeesData();
  }, [pageNumber]);  // // Delete Users in Backend

  const deleteEmployeeData = async (id) => {
    try {
      const { data: res } = await AuthServices.deleteEmployee(id);
      if (res) {
        getEmployeesData();
        setdeleteUserData(deleteUserData);
      }
    }
    catch (error) {
      console.log(error.response.data.msg);
    }
  }

  return (
    <>
      <div className="mt-5">
        <div className="container">
          <h1>
            Employees
          </h1>
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
                    <td>{element.joiningDate}</td>
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
              }) : <tr><td>No Employee</td></tr>}
            </tbody>
          </table>

          {loginData.userType === 755 && <ul className="pagination">
            <li className="page-item">
              <button className="page-link" onClick={() => {
                setPageNumber(Math.max(0, pageNumber - 1));
              }} aria-label="Previous">
                <span aria-hidden="true">&laquo;</span>
                <span className="sr-only">Previous</span>
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
                <span className="sr-only">Next</span>
              </button>
            </li>
          </ul>}

        </div>
      </div>
    </>
  );
};

export default Admin;
