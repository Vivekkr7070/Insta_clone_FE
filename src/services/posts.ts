import api from './api';

export const getPosts = async () => {
  const response = await api.get('/api/posts');
  return response.data;
};

export const likePost = async (postId: string) => {
  return api.post(`/posts/${postId}/like`);
};

export const createPost = async (title: string, content: string,token:string): Promise<void> => {
  
  try {
    const response =  await api.post(
      `/api/posts`,
      {  title, content }, // Sending `id` in the request body
      {
        headers: {
          Authorization: `Bearer ${token}`, // Sending the token in the Authorization header
        },
      }
    );
    return response.data; // Return the response data
  } catch (error) {
    console.error('Error following user:', error);
    throw error;
  }
};