import React, { useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Signup from './components/signup/signup.js';
import Navbar from './components/navbar/navbar.js';
import Login from './components/login/login.js';
import Home from './components/home/home.js';
import Admin from './components/admin/admin.js';
import Meeting from './components/meeting/meeting.js';

// Importing Boostrap Min Files

import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import '../node_modules/bootstrap/dist/js/bootstrap.bundle.min';
import '../node_modules/react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';


import { loginContext } from './components/context/contextProvider.js';

function App() {
  const [loginData, setloginData] = useContext(loginContext);

  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" exact element={<Home />} />
        <Route path="/login" exact element={<Login />} />
        <Route path="/signup" exact element={<Signup />} />
        {loginData && (loginData.userType === 755 || loginData.userType === 955) ? (
          <>
            <Route path="/admin" exact element={<Admin />} />
            <Route path="/meetings" exact element={<Meeting />} />
          </>
        ) : (
          <>
            {loginData && loginData.userType === 255 ? (
              <>
                <Route path="/employee" exact element={<Admin />} />
                <Route path="/meetings" exact element={<Meeting />} />
              </>
            )
              : (
                <></>
              )}
          </>
        )}
        <Route path="/*" exact element={<Navigate replace to="/login" />} />
      </Routes>
      <ToastContainer autoClose={2000} limit={3} />
    </>
  );
}

export default App;
