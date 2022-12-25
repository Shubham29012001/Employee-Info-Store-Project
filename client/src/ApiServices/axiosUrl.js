import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://employee-info-store.onrender.com/api/v1',
});

export default axiosInstance;
