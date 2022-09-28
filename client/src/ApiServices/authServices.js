import axios from './axiosUrl.js';

const getUserDetails = JSON.parse(localStorage.getItem("userDetails"));

class AuthServices {

  signup(data) {
    return axios.post('/signup', data);
  }

  login(data) {
    return axios.post('/login', data);
  }


  getEmployees(page, data) {
    const { designation, team, reportingTo, joiningDate } = data;
    let sort = -1;
    if (joiningDate) {
      sort = 1;
    }

    return axios.get(`/employees/?page=${page}&sort=${sort}&designation=${designation}&team=${team}&reporting=${reportingTo}`, {
      headers: {
        Authorization:
          "Bearer " +
          getUserDetails.accessToken,
      }
    })
  }

  deleteEmployee(id) {
    return axios.delete(`/employees/employee/${id}`, {
      headers: {
        Authorization:
          "Bearer " +
          getUserDetails.accessToken,
      }
    })
  }

  getEmployee(id) {
    return axios.get(`/employees/employee/${id}`, {
      headers: {
        Authorization:
          "Bearer " +
          getUserDetails.accessToken,
      }
    })
  }

  getEmployeesByTeam(email) {
    return axios.post(`/employees/employee/team`, email, {
      headers: {
        Authorization:
          "Bearer " +
          getUserDetails.accessToken,
      }
    })
  }

  updateEmployee(id, data) {
    return axios.put(`/employees/employee/${id}`, data, {
      headers: {
        Authorization:
          "Bearer " +
          getUserDetails.accessToken,
      }
    })
  }

  giveAdminAccess(id) {
    return axios.put(`/employees/employee/access/${id}`, '', {
      headers: {
        Authorization:
          "Bearer " +
          getUserDetails.accessToken,
      }
    })
  }
  getMeetings(page) {
    return axios.get(`/meetings/?page=${page}`, {
      headers: {
        Authorization:
          "Bearer " +
          getUserDetails.accessToken,
      }
    })
  }

  getMeetingsByIndividual(particularValue) {
    return axios.post(`/meetings/individual`, particularValue, {
      headers: {
        Authorization:
          "Bearer " +
          getUserDetails.accessToken,
      }
    })
  }

  getMeeting(id) {
    return axios.get(`/meetings/${id}`, {
      headers: {
        Authorization:
          "Bearer " +
          getUserDetails.accessToken,
      }
    })
  }

  deleteMeeting(id) {
    return axios.delete(`/meetings/${id}`, {
      headers: {
        Authorization:
          "Bearer " +
          getUserDetails.accessToken,
      }
    })
  }

  updateMeeting(id, data) {
    return axios.put(`/meetings/${id}`, data, {
      headers: {
        Authorization:
          "Bearer " +
          getUserDetails.accessToken,
      }
    })
  }

  createMeeting(data) {
    return axios.post(`/meetings/`, data, {
      headers: {
        Authorization:
          "Bearer " +
          getUserDetails.accessToken,
      }
    })
  }

  getEmployeesEmail() {
    return axios.get(`/employees/emails`, {
      headers: {
        Authorization:
          "Bearer " +
          getUserDetails.accessToken,
      }
    })
  }

  abortMeeting(id) {
    return axios.post(`/meetings/abort/${id}`, '', {
      headers: {
        Authorization:
          "Bearer " +
          getUserDetails.accessToken,
      }
    })
  }

}


export default new AuthServices();
