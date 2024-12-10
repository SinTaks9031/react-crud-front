import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'https://node-crud-backend-116a6110dbe3.herokuapp.com/api',
});

export default axiosInstance;
