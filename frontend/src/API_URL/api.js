import axios from 'axios';

const api = axios.create({
    baseURL: 'https://employee-management-system-backend-nvdf.onrender.com',
});

export default api;
