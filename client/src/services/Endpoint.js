import axios from 'axios';

export const BaseUrl = import.meta.env.VITE_SERVER_APP_URL;

const instance = axios.create({
  baseURL: BaseUrl,
  withCredentials: true,
});

instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    // console.log('Token from localStorage:', token); // Debug token presence
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
      // console.log('Authorization header set:', config.headers['Authorization']); // Debug header
    } else {
      console.log('No token found in localStorage');
    }
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

instance.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("Response interceptor error:", {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
    });
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/";
      throw new Error("Unauthorized: Please log in again.");
    }
    return Promise.reject(error);
  }
);

const API = axios.create({
  baseURL: BaseUrl,
});

export const get = (url, params) => instance.get(url, { params });
export const post = (url, data, config) => instance.post(url, data, config);
export const classPost = (url, data, config) => instance.post(url, data, config);
export const classGet = (url, params) => instance.get(url, { params });
export const addstudentsPost = (url, data) => instance.post(url, data);
export const deleteRequest = (url, data) => instance.delete(url, { data });

export const downloadFile = (url) =>
  instance.get(url, { responseType: 'blob' });

export const getUser = async () => {
  try {
    const token = localStorage.getItem('token');
    console.log('getUser Token:', token); // Debug token for getUser
    const response = await API.get('/auth/getusers', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response;
  } catch (error) {
    console.error('Failed to fetch current user:', error);
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/';
      throw new Error('Unauthorized: Please log in again.');
    }
    throw error;
  }

  
};