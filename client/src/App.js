import React, { useContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Signup from './components/signup/signup.js';
import Navbar from './components/navbar/navbar.js';
import Login from './components/login/login.js';
import Dashboard from './components/dashboard/dashboard.js';
import Home from './components/home/home.js';
import Admin from './components/admin/admin.js';
import Detail from './components/detail/detail.js';
import Edit from './components/edit/edit.js';
import Meeting from './components/meeting/meeting.js';
import EditMeeting from './components/editmeeting/editmeeting.js';

// Importing Boostrap Min Files

import '../node_modules/bootstrap/dist/css/bootstrap.min.css';
import '../node_modules/bootstrap/dist/js/bootstrap.bundle.min';

import { loginContext } from './components/context/contextProvider.js';
import CreateMeeting from './components/createmeeting/createmeeting.js';

function App() {
  const [loginData, setloginData] = useContext(loginContext);
  const userType = loginData.userType;
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" exact element={<Home />} />
        <Route path="/login" exact element={<Login />} />
        <Route path="/signup" exact element={<Signup />} />
        {userType === 755 ? (
          <>
            <Route path="/admin" exact element={<Admin />} />
            <Route path="/meetings" exact element={<Meeting />} />
            <Route path="/meetings/create" exact element={<CreateMeeting />} />
            <Route path="/meetings/edit/:id" exact element={<EditMeeting />} />
            <Route path="/edit/:id" exact element={<Edit />} />
            <Route path="/view/:id" exact element={<Detail />} />
          </>
        ) : (
          <>
            {userType === 255 ? (
              <>
                <Route path="/dashboard" exact element={<Dashboard />} />
                <Route path="/meetings/create" exact element={<CreateMeeting />} />
                <Route path="/meetings/edit/:id" exact element={<EditMeeting />} />
              </>
            )
              : (
                <></>
              )}
          </>
        )}

      </Routes>
    </>
  );
}

export default App;
