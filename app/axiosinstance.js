import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'https://gamehub-api-4872c3a36c6c.herokuapp.com',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default axiosInstance;
