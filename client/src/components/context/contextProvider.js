import React, { createContext, useState } from 'react';

export const addUserDataContext = createContext('');
export const addMeetDataContext = createContext('');
export const updateUserDataContext = createContext('');
export const updateMeetDataContext = createContext('');
export const deleteUserDataContext = createContext('');
export const deleteMeetDataContext = createContext('');
export const loginContext = createContext('');

const ContextProvider = ({ children }) => {
  const [userData, setuserData] = useState('');
  const [meetData, setmeetData] = useState('');
  const [updateUserData, setupdateUserData] = useState('');
  const [updateMeetData, setupdateMeetData] = useState('');
  const [deleteUserData, setdeleteUserData] = useState('');
  const [deleteMeetData, setdeleteMeetData] = useState('');
  const [loginData, setloginData] = useState(localStorage.getItem('userDetails') ? JSON.parse(localStorage.getItem('userDetails')) : '');

  return (
    <loginContext.Provider value={[loginData, setloginData]} >
      <addUserDataContext.Provider value={[userData, setuserData]}>
        <addMeetDataContext.Provider value={[meetData, setmeetData]}>
          <updateUserDataContext.Provider value={[updateUserData, setupdateUserData]}>
            <updateMeetDataContext.Provider value={[updateMeetData, setupdateMeetData]}>
              <deleteUserDataContext.Provider
                value={[deleteUserData, setdeleteUserData]}
              >
                <deleteMeetDataContext.Provider
                  value={[deleteMeetData, setdeleteMeetData]}
                >
                  {children}
                </deleteMeetDataContext.Provider>
              </deleteUserDataContext.Provider>
            </updateMeetDataContext.Provider>
          </updateUserDataContext.Provider>
        </addMeetDataContext.Provider>
      </addUserDataContext.Provider>
    </loginContext.Provider>
  );
};

export default ContextProvider;
