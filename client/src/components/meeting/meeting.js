import React, { useState, useEffect, useContext } from 'react';
import { NavLink } from 'react-router-dom';
import "./meetings.css";
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import Loader from '../loader/loader';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import {
    addMeetDataContext,
    updateMeetDataContext,
    deleteMeetDataContext,
    loginContext
} from '../context/contextProvider.js';

import { toast } from 'react-toastify';
import GroupsIcon from '@mui/icons-material/Groups';
import AuthServices from '../../ApiServices/authServices.js';
import CancelIcon from '@mui/icons-material/Cancel';
import Swal from 'sweetalert2'
import _ from 'lodash';

const Meeting = () => {
    const [pageNumber, setPageNumber] = useState(1);
    const [getMeets, setMeets] = useState([]);
    const [numberOfPages, setNumberOfPages] = useState(0);
    const [loading, setLoading] = useState(false);

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

            setLoading(true);
        }
        catch (error) {
            console.log(error.response.data.msg);
            setloginData(null)
        }
    }

    const delay = _.debounce(() => {
        getMeetingsData();
    }, 500);


    useEffect(() => {
        delay();
    }, [pageNumber]);  // // Delete Users in Backend

    const deleteMeetingData = async (id) => {
        try {
            const swalFire = await Swal.fire({
                title: 'Do you want to delete it?',
                text: "You won't be able to revert this!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, delete it!'
            })

            if (swalFire.isConfirmed) {

                const { data: res } = await AuthServices.deleteMeeting(id);
                if (res) {
                    Swal.fire(
                        'Deleted!',
                        'Meeting has been deleted.',
                        'success'
                    )
                    toast.success("Meeting Deleted Successfully");
                    getMeetingsData();
                    setdeleteMeetData(deleteMeetData);
                }
            }
        }
        catch (error) {
            toast.error(error.response.data.msg);
        }
    }

    const abortMeeting = async (id) => {
        try {
            const swalFire = await Swal.fire({
                title: 'Do you want to abort it?',
                text: "You won't be able to revert this!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#3085d6',
                cancelButtonColor: '#d33',
                confirmButtonText: 'Yes, abort it!'
            })

            if (swalFire.isConfirmed) {

                const { data: res } = await AuthServices.abortMeeting(id);
                if (res) {
                    Swal.fire(
                        'Aborted!',
                        'You have aborted the meeting.',
                        'success'
                    )
                    toast.success("Meeting Aborted Successfully");
                    setdeleteMeetData(deleteMeetData);
                    getMeetingsData();
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
                    {loading === false ? <> {loginData.userType === 755 && <Loader />} </> : <> <h1> <GroupsIcon /> Meetings</h1>
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
                                    <th scope="col">Meeting Room</th>
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
                                            <td>{element.meetingRoom}</td>
                                            <td> {element.meetMembers.map((v, id) => {
                                                return (
                                                    <tr key={id + 1}><td>{id + 1}) {v}</td></tr>
                                                )
                                            })}</td>
                                            <td>{new Date(element.meetStartingTime).toLocaleString('en-GB', { timeZone: 'UTC' }) + " - " + new Date(element.meetEndingTime).toLocaleString('en-GB', { timeZone: 'UTC' })}</td>
                                            <td className="d-flex justify-content-between">
                                                <button
                                                    className="btn btn-dark"
                                                    onClick={() => abortMeeting(element._id)}
                                                >
                                                    <CancelIcon />
                                                </button>
                                                {(loginData.userType === 755 || loginData.email === element.meetCreatedBy) &&
                                                    <>
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
                                                    </>
                                                }
                                            </td>
                                        </tr>
                                    );
                                }) : <td colSpan="7" style={{ textAlign: "center" }}>No Meetings</td>}
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
                    </>}

                </div>
            </div>
        </>
    );
};

export default Meeting;
