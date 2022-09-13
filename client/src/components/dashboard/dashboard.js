import React, { useContext } from 'react';
import { loginContext } from '../context/contextProvider';
import Meetings from '../meeting/meeting';
import Admin from '../admin/admin';

const Dashboard = () => {
  const [loginData, setloginData] = useContext(loginContext);

  return (
    <>
      <Admin />
      <Meetings />
    </>
  )
};

export default Dashboard;
