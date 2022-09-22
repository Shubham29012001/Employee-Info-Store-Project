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

import { Tooltip, IconButton } from '@mui/material';
import { toast } from 'react-toastify';
import GroupsIcon from '@mui/icons-material/Groups';
import AuthServices from '../../ApiServices/authServices.js';
import CancelIcon from '@mui/icons-material/Cancel';
import Swal from 'sweetalert2'
import GridTable from "@nadavshaar/react-grid-table";

const Meeting = () => {
    const [row, setRow] = useState([]);
    const [loading, setLoading] = useState(false);

    // Using Context Values

    // const [userData, setuserData] = useContext(addUserDataContext);
    // const [updateUserData, setupdateUserData] = useContext(updateUserDataContext);
    const [deleteMeetData, setdeleteMeetData] = useContext(deleteMeetDataContext);
    const [loginData, setloginData] = useContext(loginContext);


    const columns = [
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
            field: "meetTitle",
            label: "Meet Title"
        },
        {
            id: 3,
            field: "meetCreatedBy",
            label: "Meet Created By",
        },
        {
            id: 4,
            field: "meetingRoom",
            label: "Meeting Room ",
        },
        {
            id: 5,
            field: "meetMembers",
            label: "Meet Participants",
            cellRenderer: ({ tableManager, value, field, data, column, colIndex, rowIndex }) => {
                return (
                    <div data-row-id={rowIndex} data-row-index={rowIndex} data-column-id={colIndex} className={`rgt-cell rgt-row-${rowIndex} rgt-row-odd rgt-cell-name`} >
                        <div className={`rgt-cell-inner rgt-text-truncate`} title={`${rowIndex}`} >
                            {data.meetMembers.map((v, id) => {
                                return (
                                    <ul style={{ margin: "0", padding: "0" }}>
                                        <tr key={id + 1} ><td>{id + 1}) {v}</td></tr>
                                    </ul>
                                )
                            })}
                        </div>
                    </div>
                )
            }

        },
        {
            id: 6,
            field: "meetTiming",
            label: "Meet Timing ",
            cellRenderer: ({ tableManager, value, field, data, column, colIndex, rowIndex }) => {
                return (
                    <div data-row-id={rowIndex} data-row-index={rowIndex} data-column-id={colIndex} className={`rgt-cell rgt-row-${rowIndex} rgt-row-odd rgt-cell-name`} >
                        <div className={`rgt-cell-inner rgt-text-truncate`} title={`${rowIndex}`} >
                            {new Date(data.meetStartingTime).toLocaleString('en-GB', { timeZone: 'IST' })}<br /> {new Date(data.meetEndingTime).toLocaleString('en-GB', { timeZone: 'IST' })}
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
                                <Tooltip title="Abort Meeting">
                                    <IconButton>
                                        <CancelIcon className="logo abort" onClick={() => abortMeeting(data._id)} />
                                    </IconButton>
                                </Tooltip>
                                {
                                    (loginData.userType === 755 || loginData.email === data.meetCreatedBy) &&
                                    <>
                                        <Tooltip title="Edit Meeting">
                                            <IconButton >
                                                <NavLink to={`/meetings/edit/${data._id}`}>
                                                    <EditIcon className="logo edit" />
                                                </NavLink>
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Delete Meeting">
                                            <IconButton >
                                                <DeleteIcon className="logo delete" onClick={() => deleteMeetingData(data._id)} />
                                            </IconButton>
                                        </Tooltip>
                                    </>
                                }
                            </div >
                        </div >

                    </>

                )
            }
        },
    ];


    const getMeetingsData = async (e) => {
        try {
            if (loginData.userType === 755) {
                const { data: res } = await AuthServices.getMeetings();
                if (res) {
                    setRow(res.allMeetings);
                }
            }
            else {
                const { data: res } = await AuthServices.getMeetingsByIndividual(loginData.email);
                if (res) {
                    setRow(res.findParticularMeet);
                }
            }

            setLoading(true);
        }
        catch (error) {
            console.log(error.response.data.msg);
            setloginData(null)
            setLoading(false)
            setRow([])
        }
    }


    useEffect(() => {
        getMeetingsData();
    }, []);  // // Delete Users in Backend

    const deleteMeetingData = async (id) => {
        try {
            const swalFire = await Swal.fire({
                title: 'Do you want to delete it?',
                text: "You won't be able to revert this!",
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#d33',
                cancelButtonColor: '#3085d6',
                confirmButtonText: 'Yes, delete it!'
            })

            if (swalFire.isConfirmed) {

                const { data: res } = await AuthServices.deleteMeeting(id);
                if (res) {
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
                confirmButtonColor: '#d33',
                cancelButtonColor: '#3085d6',
                confirmButtonText: 'Yes, abort it!'
            })

            if (swalFire.isConfirmed) {

                const { data: res } = await AuthServices.abortMeeting(id);
                if (res) {
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
            <div className="mt-3">
                <div className="container">
                    {loading === false ? <> <Loader /> </> : <><h1> <GroupsIcon /> Meetings</h1>
                        <div className="add-btn mt-2">
                            <NavLink className="btn btn-primary navlink" style={{ backgroundColor: "#25316d" }} to="/meetings/create">
                                Create Meetings
                            </NavLink>
                        </div>
                        <GridTable columns={columns} rows={row} pageSize={4} />
                    </>}

                </div>
            </div >
        </>
    );
};

export default Meeting;
