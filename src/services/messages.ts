// import api from './api';

// export const getFriends = async () => {
//   const response = await api.get('/friends');
//   return response.data;
// };

// export const getMessages = async (friendId: string) => {
//   const response = await api.get(`/messages/${friendId}`);
//   return response.data;
// };

// export const sendMessage = async (friendId: string, content: string) => {
//   return api.post(`/messages/${friendId}`, { content });
// };


import axios from './api';

// Fetch list of friends
export const fetchFriends = async () => {
  const response = await axios.get('/api/users');
  console.log(response.data)

  return response.data;
};

// Fetch messages with a specific friend
export const fetchMessages = async (friendId: string) => {
  const response = await axios.get(`/api/messages/messages/${friendId}`);
  return response.data; 
};

// Send a message
export const sendMessage = async (friendId: string, content: string) => {
  const response = await axios.post(`/messages/${friendId}`, { content });
  return response.data;
};