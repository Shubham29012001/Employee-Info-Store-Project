import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";

// Importing updateContext Provider
import KeyboardBackspaceIcon from '@mui/icons-material/KeyboardBackspace';

import { updateMeetDataContext, loginContext } from "../context/contextProvider.js";
import AuthServices from "../../ApiServices/authServices.js";
import Fade from 'react-reveal/Fade';
import Zoom from 'react-reveal/Zoom';
import { toast } from 'react-toastify';

const EditMeeting = () => {
    const history = useNavigate("");

    const [updateMeetData, setupdateMeetData] = useContext(updateMeetDataContext);
    const [loginData, setloginData] = useContext(loginContext);

    const [data, setData] = useState({
        meetingRoom: "",
        meetTitle: "",
        meetCreatedBy: "",
        meetMembers: "",
        meetStartingTime: "",
        meetEndingTime: "",
    });

    const handleChange = ({ currentTarget: input }) => {
        setData({ ...data, [input.name]: input.value });
    };

    const { id } = useParams("");
    const getMeetingData = async () => {
        try {
            const { data: res } = await AuthServices.getMeeting(id);
            if (res) {
                res.individualMeetDetails.meetStartingTime = res.individualMeetDetails.meetStartingTime.split('.')[0]
                res.individualMeetDetails.meetEndingTime = res.individualMeetDetails.meetEndingTime.split('.')[0];
                console.log(res.individualMeetDetails.meetEndingTime);
                setData(res.individualMeetDetails);
            }
        }
        catch (error) {
            console.log(error.response.data.msg);
        }
    }
    useEffect(() => {
        getMeetingData();
    }, []);

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
                const { data: res } = await AuthServices.updateMeeting(id, data);
                if (res) {
                    toast.success('Meeting Updated Successfully');
                    history('/meetings')
                }
            }
            catch (error) {
                toast.error(error.response.data.msg);
            }
        }

    };

    return (
        <Zoom duration={500}>
            <div className="container mt-3 mb-4">
                <form onSubmit={handleSubmit}>
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
                            <select class="form-select" aria-label="Default select example" id="meetingRoom" name="meetingRoom" onChange={handleChange} value={data.meetingRoom}>
                                <option disabled selected>Meeting Room</option>
                                <option value="1">1</option>
                                <option value="2">2</option>
                                <option value="3">3</option>
                                <option value="4">4</option>
                                <option value="5">5</option>
                                <option value="6">6</option>
                            </select>
                        </div>
                        <div className="mb-3 d-flex justify-content-center">
                            <KeyboardBackspaceIcon className="col-lg-3 col-md-3 col-12 m-4" style={{ fontSize: "40px", cursor: "pointer" }} onClick={() => {
                                history('/meetings');
                            }} />
                            <button type="submit" className="btn btn-primary col-lg-2 col-md-3 col-12 m-4" style={{ backgroundColor: "#25316d" }}>
                                Submit
                            </button>
                        </div>
                    </div>
                </form >
            </div >
        </Zoom>

    );
};

export default EditMeeting;