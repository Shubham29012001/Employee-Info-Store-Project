import React, { useContext } from 'react';
import { loginContext } from '../context/contextProvider';
import Meetings from '../meeting/meeting';
import Admin from '../admin/admin';
import Fade from 'react-reveal/Fade'
import Zoom from 'react-reveal/Zoom';
const Dashboard = () => {
  const [loginData, setloginData] = useContext(loginContext);

  return (
    <>
      <Fade>
        <Admin />
        <Meetings />
      </Fade>

    </>
  )
};

export default Dashboard;
