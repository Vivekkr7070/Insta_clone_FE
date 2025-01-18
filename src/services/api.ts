import axios from 'axios';

const api = axios.create({
  // baseURL: 'http://localhost:6001', // Replace with your API endpoint
  baseURL: 'https://insta-clone-i8e1.onrender.com', // Replace with your API endpoint
  headers: { 'Content-Type': 'application/json' },
});

// Add interceptors
// api.interceptors.response.use(
//   response => response,
//   error => {
//     if (error.response?.status === 401) {
//       // Handle token expiration
//       localStorage.removeItem('authToken');
//       window.location.href = '/login';
//     }
//     return Promise.reject(error);
//   }
// );


export default api;