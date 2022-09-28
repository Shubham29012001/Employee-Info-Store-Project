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

import moment from 'moment';

import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import { Tooltip, IconButton } from '@mui/material';
import { toast } from 'react-toastify';
import GroupsIcon from '@mui/icons-material/Groups';
import AuthServices from '../../ApiServices/authServices.js';
import Swal from 'sweetalert2'
import GridTable from "@nadavshaar/react-grid-table";
import SaveIcon from '@mui/icons-material/Save';
import AddIcon from '@mui/icons-material/Add';
import PersonOffIcon from '@mui/icons-material/PersonOff';
import { MuiChipsInput } from 'mui-chips-input'
import Autocomplete from '@material-ui/lab/Autocomplete';
import { makeStyles, createStyles } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';

const Meeting = () => {

    const useStyles = makeStyles((theme) =>
        createStyles({
            root: {
                width: 500,
                '& > * + *': {
                    marginTop: theme.spacing(3),
                },
            },
        }),
    );

    const [row, setRow] = useState([]);
    const [loading, setLoading] = useState(false);
    const [show, setShow] = useState(false);
    const [editShow, seteditShow] = useState(false);
    const [email, setEmail] = useState([]);

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
        meetCreatedBy: JSON.parse(localStorage.getItem('userDetails')).email,
        meetMembers: [],
        meetStartingTime: "",
        meetEndingTime: "",
    });

    const getEmployeesEmail = async () => {
        try {
            const { data: res } = await AuthServices.getEmployeesEmail();
            if (res) {

                const fetchEmail = res.allEmails.map(function (obj) {
                    return obj.email;
                })

                setEmail(fetchEmail);
            }
        }
        catch (error) {
            console.log(error.response.data.msg);
            setloginData(null)
            localStorage.removeItem('userDetails');
            setLoading(false)
        }
    }

    const classes = useStyles();

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
                            <ul style={{ marginTop: "10px", padding: "0" }}>
                                {data.meetMembers.map((v, id) => {
                                    return (
                                        <li key={id + 1} >{id + 1}) {v}</li>
                                    )
                                })}
                            </ul>
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
                            {moment(data.meetStartingTime).format("DD/MM/YYYY, hh:mm A")}<br /> {moment(data.meetEndingTime).format("DD/MM/YYYY, hh:mm A")}
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
                                {data.meetMembers.includes(loginData.name) && <Tooltip title="Abort Meeting">
                                    <IconButton onClick={() => abortMeeting(data._id)}>
                                        <PersonOffIcon className="logo abort" />
                                    </IconButton>
                                </Tooltip>}

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
            localStorage.removeItem('userDetails');
            setLoading(false)
        }
    }

    const getIndividualMeetingData = async (id) => {
        try {
            const { data: res } = await AuthServices.getMeeting(id);
            if (res) {
                res.individualMeetDetails.meetStartingTime = moment(res.individualMeetDetails.meetStartingTime).format("yyyy-MM-DDTHH:mm");
                res.individualMeetDetails.meetEndingTime = moment(res.individualMeetDetails.meetEndingTime).format("yyyy-MM-DDTHH:mm");
                setData(res.individualMeetDetails);
            }
        }
        catch (error) {
            console.log(error.response.data.msg);
            localStorage.removeItem('userDetails');
            setloginData(null);
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
        getEmployeesEmail();
    }, []);  // // Delete Users in Backend


    return (
        <>
            <div className="mt-3">
                <div className="container">
                    {loading === false ? <> <Loader /> </> : <>
                        <div className="add-btn mt-4 btn btn-primary navlink createMeeting mb-4" onClick={handleShow}>
                            Create Meetings <AddIcon />
                        </div>
                        <GridTable className="mt-3 gridtable" columns={columns} rows={row} pageSize={4} requestDebounceTimeout={500} />
                    </>}

                    <Modal size="lg" show={show} onHide={handleClose} centered>
                        <Modal.Header closeButton>
                            <Modal.Title className="w-100 text-center">Create Meetings</Modal.Title>
                        </Modal.Header>
                        <Modal.Body className="mt-2">
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
                                        <Autocomplete
                                            multiple
                                            limitTags={3}
                                            id="meetMembers"
                                            options={email}
                                            onChange={(event, value) => {
                                                setData({
                                                    ...data,
                                                    meetMembers: value
                                                })
                                            }}
                                            renderInput={(params) => (
                                                <TextField {...params} variant="outlined" placeholder="Meet Members" />
                                            )}
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
                            <Modal.Title className="w-100 text-center">Edit Meetings</Modal.Title>
                        </Modal.Header>
                        <Modal.Body className="mt-2">
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
                                        <Autocomplete
                                            multiple
                                            limitTags={3}
                                            id="meetMembers"
                                            options={email}

                                            onChange={(event, value) => {
                                                setData({
                                                    ...data,
                                                    meetMembers: value
                                                })
                                            }}
                                            renderInput={(params) => (
                                                <TextField {...params} variant="outlined" placeholder="Meet Members" />
                                            )}
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
                                Edit <SaveIcon className="logo" />
                            </Button>
                        </Modal.Footer>
                    </Modal>
                </div>
            </div >
        </>
    );
};

export default Meeting;
