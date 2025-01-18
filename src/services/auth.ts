import api from './api';

export const registerUser = async (username: string, email: string, password: string) => {
  console.log("🚀 ~ register ~ password:", password)
  return api.post('/api/auth/register', { username, email, password });
};

export const login = async (username: string, password: string) => {
  const response = await api.post('/api/auth/login', { username, password });
  return response;
};