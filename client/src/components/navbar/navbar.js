import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { loginContext, addUserDataContext, addMeetDataContext, updateMeetDataContext, updateUserDataContext, deleteMeetDataContext, deleteUserDataContext } from '../context/contextProvider';
import LoginIcon from '@mui/icons-material/Login';
import AppRegistrationIcon from '@mui/icons-material/AppRegistration';
import PeopleIcon from '@mui/icons-material/People';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import "./navbar.css";

const Navbar = () => {

  const [loginData, setloginData] = useContext(loginContext);
  const [userData, setuserData] = useContext(addUserDataContext);
  const [meetData, setmeetData] = useContext(addMeetDataContext);
  const [updateUserData, setupdateUserData] = useContext(updateUserDataContext);
  const [updateMeetData, setupdateMeetData] = useContext(updateMeetDataContext);
  const [deleteUserData, setdeleteUserData] = useContext(deleteUserDataContext);
  const [deleteMeetData, setdeleteMeetData] = useContext(deleteMeetDataContext);

  const navigate = useNavigate('');

  return (
    <header>
      <nav className="navbar navbar-expand-lg sticky-top navbar-dark">
        <div className="container-fluid">
          <div className="navbar-items ">
            <Link className="navbar-brand" to="/">
              Employee Info Store
            </Link>
          </div>
          <div className="navbar-items">
            <button
              className="navbar-toggler"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#navbarSupportedContent"
              aria-controls="navbarSupportedContent"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon"></span>
            </button>
            <div className="collapse navbar-collapse" id="navbarSupportedContent">
              <ul className="navbar-nav me-auto my-2 my-lg-0 register">
                {!loginData &&
                  <>
                    <li className="nav-item">
                      <Link
                        className="nav-link"
                        aria-current="page"
                        to="/login"
                      >
                        <LoginIcon /> Login
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link
                        className="nav-link"
                        aria-current="page"
                        to="/signup"
                      >
                        <AppRegistrationIcon /> Signup
                      </Link>
                    </li>
                  </>

                }
                {loginData && (loginData.userType === 755 || loginData.userType === 955) &&
                  <>
                    <li className="nav-item">
                      <Link
                        className="nav-link"
                        aria-current="page"
                        to="/admin"
                      >
                        <PeopleIcon /> Employees
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link
                        className="nav-link"
                        aria-current="page"
                        to="/meetings"
                      >
                        <MeetingRoomIcon /> Meetings
                      </Link>
                    </li>
                  </>

                }
                {loginData && loginData.userType === 255 &&
                  <>
                    <li className="nav-item">
                      <Link
                        className="nav-link"
                        aria-current="page"
                        to="/employee"
                      >
                        <PeopleIcon /> Employees
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link
                        className="nav-link"
                        aria-current="page"
                        to="/meetings"
                      >
                        <MeetingRoomIcon /> Meetings
                      </Link>
                    </li>
                  </>

                }

                {loginData && loginData.userType &&

                  <li className="nav-item">
                    <button
                      className="nav-link logout"
                      aria-current="page"
                      onClick={() => {
                        localStorage.removeItem('userDetails');
                        setloginData(null);
                        setuserData(null);
                        setmeetData(null);
                        setupdateMeetData(null);
                        setupdateUserData(null);
                        setdeleteMeetData(null);
                        setdeleteUserData(null);
                        navigate('/')
                      }}
                    >
                      Logout
                    </button>
                  </li>}
              </ul>
            </div>
          </div>

        </div>
      </nav>
    </header >
  );
};

export default Navbar;
