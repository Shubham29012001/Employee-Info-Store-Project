import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { loginContext } from '../context/contextProvider';
import LoginIcon from '@mui/icons-material/Login';
import AppRegistrationIcon from '@mui/icons-material/AppRegistration';

import "./navbar.css";

const Navbar = () => {

  const [loginData, setloginData] = useContext(loginContext);
  const navigate = useNavigate('');

  return (
    <header>
      <nav className="navbar navbar-expand-lg sticky-top navbar-dark bg-primary">
        <div className="container-fluid">
          <Link className="navbar-brand" to="/">
            Employee Info Store
          </Link>
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
              {loginData && loginData.userType === 755 &&
                <>
                  <form className="d-flex" role="search">
                    <input
                      className="form-control me-2"
                      type="search"
                      placeholder="Search"
                      aria-label="Search"
                    />
                    <button className="btn btn-outline-success" type="submit">
                      Search
                    </button>
                  </form>
                  <li className="nav-item">
                    <Link
                      className="nav-link "
                      aria-current="page"
                      to="/admin"
                    >
                      Employees
                    </Link>
                  </li>
                  <li className="nav-item">
                    <Link
                      className="nav-link "
                      aria-current="page"
                      to="/meetings"
                    >
                      Meetings
                    </Link>
                  </li>
                </>

              }
              {loginData && loginData.userType &&
                <li className="nav-item">
                  <button
                    className="nav-link "
                    aria-current="page"
                    onClick={() => {
                      localStorage.removeItem('userDetails');
                      navigate('/')
                    }}
                  >
                    Logout
                  </button>
                </li>
              }
            </ul>
          </div>
        </div>
      </nav>
    </header >
  );
};

export default Navbar;
