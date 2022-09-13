import React, { useState, useEffect, useContext } from 'react';
import { NavLink } from 'react-router-dom';
import "./meetings.css";
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import {
    addMeetDataContext,
    updateMeetDataContext,
    deleteMeetDataContext,
    loginContext
} from '../context/contextProvider.js';

import AuthServices from '../../ApiServices/authServices.js';

const Meeting = () => {
    const [pageNumber, setPageNumber] = useState(1);
    const [getMeets, setMeets] = useState([]);
    const [numberOfPages, setNumberOfPages] = useState(0);

    // Using Context Values

    // const [userData, setuserData] = useContext(addUserDataContext);
    // const [updateUserData, setupdateUserData] = useContext(updateUserDataContext);
    const [deleteMeetData, setdeleteMeetData] = useContext(deleteMeetDataContext);
    const [loginData, setloginData] = useContext(loginContext);

    const pages = new Array(numberOfPages).fill(null).map((v, i) => i);

    const getMeetingsData = async (e) => {
        try {
            if (loginData.userType === 755) {
                const { data: res } = await AuthServices.getMeetings(pageNumber);
                if (res) {
                    setMeets(res.allMeetings);
                    setNumberOfPages(res.numberOfPages)
                }
            }
            else {
                const { data: res } = await AuthServices.getMeetingsByIndividual(loginData.email);
                if (res) {
                    setMeets(res.findParticularMeet);
                }
            }
        }
        catch (error) {
            console.log(error.response.data.msg);
        }
    }

    useEffect(() => {
        getMeetingsData();
    }, [pageNumber]);  // // Delete Users in Backend

    const deleteMeetingData = async (id) => {
        try {
            const { data: res } = await AuthServices.deleteMeeting(id);
            if (res) {
                getMeetingsData();
                setdeleteMeetData(deleteMeetData);
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
                    <h1>Meetings</h1>
                    <div className="add-btn mt-2">
                        <NavLink className="btn btn-primary navlink" to="/meetings/create">
                            Create Meetings
                        </NavLink>
                    </div>
                    <table className="table mt-5">
                        <thead>
                            <tr className="table-dark">
                                <th scope="col">ID</th>
                                <th scope="col">Title</th>
                                <th scope="col">Created By</th>
                                <th scope="col">Participants</th>
                                <th scope="col">Meet Timing</th>
                                <th scope="col">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {getMeets && getMeets.length > 0 ? getMeets.map((element, id) => {

                                return (
                                    <tr key={id + 1}>
                                        <th scope="row">{id + 1}</th>
                                        <td>{element.meetTitle}</td>
                                        <td>{element.meetCreatedBy}</td>
                                        <td> {element.meetMembers.map((v, id) => {
                                            return (
                                                <tr key={id + 1}><td>{id + 1}) {v}</td></tr>
                                            )
                                        })}</td>
                                        <td>{new Date(element.meetStartingTime).toISOString() + " - " + new Date(element.meetEndingTime).toISOString()}</td>
                                        {(loginData.userType === 755 || loginData.email === element.meetCreatedBy) &&
                                            <td className="d-flex justify-content-between">
                                                <NavLink to={`/meetings/edit/${element._id}`}>
                                                    <button className="btn btn-primary">
                                                        <EditIcon />
                                                    </button>
                                                </NavLink>
                                                <button
                                                    className="btn btn-danger"
                                                    onClick={() => deleteMeetingData(element._id)}
                                                >
                                                    <DeleteIcon />
                                                </button>
                                            </td>
                                        }
                                    </tr>
                                );
                            }) : <tr><td>No Meetings</td></tr>}
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

export default Meeting;
