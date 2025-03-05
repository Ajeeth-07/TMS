import axios from 'axios';

const api = axios.create({
  baseURL: "https://tms-backend-91b1.onrender.com/api",
});


//request interceptor to include token headers
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if(token){
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
})

export default api;