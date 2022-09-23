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

import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
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
    const [show, setShow] = useState(false);
    const [editShow, seteditShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const handleEditClose = () => seteditShow(false);
    const handleEditShow = () => seteditShow(true);

    const [deleteMeetData, setdeleteMeetData] = useContext(deleteMeetDataContext);
    const [loginData, setloginData] = useContext(loginContext);
    const [updateMeetData, setupdateMeetData] = useContext(updateMeetDataContext);
    const [meetData, setmeetData] = useContext(addMeetDataContext);

    const [data, setData] = useState({
        _id: "",
        meetingRoom: "",
        meetTitle: "",
        meetCreatedBy: loginData.email,
        meetMembers: "",
        meetStartingTime: "",
        meetEndingTime: "",
    });

    const handleChange = ({ currentTarget: input }) => {
        setData({ ...data, [input.name]: input.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!data.meetingRoom || !data.meetStartingTime || !data.meetEndingTime || !data.meetMembers || !data.meetTitle) {
            toast.error("Please provide complete input");
        }
        else if (data.meetStartingTime >= data.meetEndingTime) {
            toast.error("Please Provide Proper Timing for Meeting")
        }
        else {
            try {
                const { data: res } = await AuthServices.createMeeting(data);
                if (res) {
                    setmeetData(res);
                    setData('');
                    toast.success("Meeting Created Successfully");
                    handleClose();
                    getMeetingsData();
                }

            }
            catch (error) {
                toast.error(error.response.data.msg);
            }
        }

    };

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
                                    <IconButton onClick={() => abortMeeting(data._id)}>
                                        <CancelIcon className="logo abort" />
                                    </IconButton>
                                </Tooltip>
                                {
                                    (loginData.userType === 755 || loginData.userType === 955 || loginData.email === data.meetCreatedBy) &&
                                    <>
                                        <Tooltip title="Edit Meeting">
                                            <IconButton onClick={() => { handleEditShow(); getIndividualMeetingData(data._id); }}>
                                                <EditIcon className="logo edit" />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Delete Meeting">
                                            <IconButton onClick={() => deleteMeetingData(data._id)} >
                                                <DeleteIcon className="logo delete" />
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
            if (loginData.userType === 755 || loginData.userType === 955) {
                const { data: res } = await AuthServices.getMeetings();
                if (res) {
                    setRow(res.allMeetings);
                }
            }
            else if (loginData.userType === 255) {
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
        }
    }

    const getIndividualMeetingData = async (id) => {
        try {
            const { data: res } = await AuthServices.getMeeting(id);
            if (res) {
                res.individualMeetDetails.meetStartingTime = res.individualMeetDetails.meetStartingTime.split('.')[0]
                res.individualMeetDetails.meetEndingTime = res.individualMeetDetails.meetEndingTime.split('.')[0];
                setData(res.individualMeetDetails);
            }
        }
        catch (error) {
            console.log(error.response.data.msg);
        }
    }

    const handleEditSubmit = async (e) => {
        e.preventDefault();

        if (!data.meetingRoom || !data.meetStartingTime || !data.meetEndingTime || !data.meetMembers || !data.meetTitle) {
            toast.error("Please provide complete input");
        }
        else if (data.meetStartingTime >= data.meetEndingTime) {
            toast.error("Please Provide Proper Timing for Meeting")
        }
        else {
            try {
                const { data: res } = await AuthServices.updateMeeting(data._id, data);
                if (res) {
                    console.log(res)
                    toast.success('Meeting Updated Successfully');
                    setData('')
                    setupdateMeetData(res);
                    handleEditClose();
                    getMeetingsData();
                }
            }
            catch (error) {
                toast.error(error.response.data.msg);
            }
        }

    };

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
                    setdeleteMeetData(deleteMeetData);
                    getMeetingsData();
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
                    getMeetingsData();
                }
            }
        }
        catch (error) {
            toast.error(error.response.data.msg);
        }
    }

    useEffect(() => {
        getMeetingsData();
    }, []);  // // Delete Users in Backend


    return (
        <>
            <div className="mt-3">
                <div className="container">
                    {loading === false ? <> <Loader /> </> : <><h1> <GroupsIcon /> Meetings</h1>
                        <div className="add-btn mt-2 btn btn-primary navlink" onClick={handleShow}>
                            Create Meetings
                        </div>
                        <GridTable columns={columns} rows={row} pageSize={4} />
                    </>}

                    <Modal size="lg" show={show} onHide={handleClose} centered>
                        <Modal.Header closeButton>
                            <Modal.Title>Create Meetings</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <form>
                                <div className="row">
                                    <div className="mb-3 col-lg-6 col-md-6 col-12">
                                        <label htmlFor="meetTitle" className="form-label">
                                            Meet Title
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="meetTitle"
                                            name="meetTitle"
                                            aria-describedby="meetTitleHelp"
                                            onChange={handleChange}
                                            value={data.meetTitle}
                                        />
                                    </div>
                                    <div className="mb-3 col-lg-6 col-md-6 col-12">
                                        <label htmlFor="meetCreatedBy" className="form-label">
                                            Meet Created By
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="meetCreatedBy"
                                            name="meetCreatedBy"
                                            aria-describedby="meetCreatedByHelp"
                                            value={loginData.email}
                                            disabled
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="meetMembers" className="form-label">
                                            Meet Members
                                        </label>
                                        <input
                                            type="chip"
                                            className="form-control"
                                            id="meetMembers"
                                            aria-describedby="meetMembersHelp"
                                            name="meetMembers"
                                            value={data.meetMembers}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className="mb-3 col-lg-6 col-md-6 col-12">
                                        <label htmlFor="meetStartingTime" className="form-label">
                                            Meet Starting Time
                                        </label>
                                        <input
                                            type="datetime-local"
                                            className="form-control"
                                            id="meetStartingTime"
                                            aria-describedby="meetStartingTimeHelp"
                                            name="meetStartingTime"
                                            value={data.meetStartingTime}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className="mb-3 col-lg-6 col-md-6 col-12">
                                        <label htmlFor="meetEndingTime" className="form-label">
                                            Meet Ending Time
                                        </label>
                                        <input
                                            type="datetime-local"
                                            className="form-control"
                                            id="meetEndingTime"
                                            aria-describedby="meetEndingTimeHelp"
                                            name="meetEndingTime"
                                            value={data.meetEndingTime}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className="mb-3 col-lg-6 col-md-6 col-12">
                                        <label htmlFor="meetTitle" className="form-label">
                                            Meet Room No
                                        </label>
                                        <select className="form-select" aria-label="Default select example" id="meetingRoom" selected name="meetingRoom" onChange={handleChange} value={data.meetingRoom}>
                                            <option disabled >Meeting Room</option>
                                            <option value="1">1</option>
                                            <option value="2">2</option>
                                            <option value="3">3</option>
                                            <option value="4">4</option>
                                            <option value="5">5</option>
                                            <option value="6">6</option>
                                        </select>
                                    </div>
                                </div>
                            </form >
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={handleClose}>
                                Close
                            </Button>
                            <Button variant="primary" onClick={handleSubmit}>
                                Create
                            </Button>
                        </Modal.Footer>
                    </Modal>

                    <Modal size="lg" show={editShow} onHide={handleEditClose} centered>
                        <Modal.Header closeButton>
                            <Modal.Title>Edit Meetings</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <form>
                                <div className="row">
                                    <div className="mb-3 col-lg-6 col-md-6 col-12">
                                        <label htmlFor="meetTitle" className="form-label">
                                            Meet Title
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="meetTitle"
                                            name="meetTitle"
                                            aria-describedby="meetTitleHelp"
                                            onChange={handleChange}
                                            value={data.meetTitle}
                                        />
                                    </div>
                                    <div className="mb-3 col-lg-6 col-md-6 col-12">
                                        <label htmlFor="meetCreatedBy" className="form-label">
                                            Meet Created By
                                        </label>
                                        <input
                                            type="text"
                                            className="form-control"
                                            id="meetCreatedBy"
                                            name="meetCreatedBy"
                                            aria-describedby="meetCreatedByHelp"
                                            value={data.meetCreatedBy}
                                            disabled
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="meetMembers" className="form-label">
                                            Meet Members
                                        </label>
                                        <input
                                            type="chip"
                                            className="form-control"
                                            id="meetMembers"
                                            aria-describedby="meetMembersHelp"
                                            name="meetMembers"
                                            value={data.meetMembers}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className="mb-3 col-lg-6 col-md-6 col-12">
                                        <label htmlFor="meetStartingTime" className="form-label">
                                            Meet Starting Time
                                        </label>
                                        <input
                                            type="datetime-local"
                                            className="form-control"
                                            id="meetStartingTime"
                                            aria-describedby="meetStartingTimeHelp"
                                            name="meetStartingTime"
                                            value={data.meetStartingTime}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className="mb-3 col-lg-6 col-md-6 col-12">
                                        <label htmlFor="meetEndingTime" className="form-label">
                                            Meet Ending Time
                                        </label>
                                        <input
                                            type="datetime-local"
                                            className="form-control"
                                            id="meetEndingTime"
                                            aria-describedby="meetEndingTimeHelp"
                                            name="meetEndingTime"
                                            value={data.meetEndingTime}
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <div className="mb-3 col-lg-6 col-md-6 col-12">
                                        <label htmlFor="meetTitle" className="form-label">
                                            Meet Room No
                                        </label>
                                        <select className="form-select" aria-label="Default select example" id="meetingRoom" name="meetingRoom" onChange={handleChange} value={data.meetingRoom}>
                                            <option disabled selected>Meeting Room</option>
                                            <option value="1">1</option>
                                            <option value="2">2</option>
                                            <option value="3">3</option>
                                            <option value="4">4</option>
                                            <option value="5">5</option>
                                            <option value="6">6</option>
                                        </select>
                                    </div>
                                </div>
                            </form >
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
                </div>
            </div >
        </>
    );
};

export default Meeting;
