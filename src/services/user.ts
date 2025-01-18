import api from './api';

// Interface for User
interface User {
  avatar: string;
  id: string;
  username: string;
  followers: number;
  following: number;
}

// Fetch user details
export const getUserDetails = async (userId: string): Promise<User> => {
  try {
    const response = await api.get(`/api/users/${userId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching user details:', error);
    throw error;
  }
};

// Update user profile
export const updateUserProfile = async (userId: string, updates: Partial<User>): Promise<User> => {
  try {
    const response = await api.put(`/users/${userId}`, updates);
    return response.data;
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
};

// Fetch suggestions for users to follow
export const getSuggestions = async (userId: string): Promise<User[]> => {
  try {
    const response = await api.get(`/api/users/suggestions`, {
      params: { userId }, // Include userId as a query parameter
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching suggestions:', error);
    throw error;
  }
};


 // Check if the user is following
 export const checkIsFollowing = async (userId: string, profileId: string): Promise<boolean> => {
  try {
    const response = await api.get(`/api/users/is-following/${userId}/${profileId}`);
    return response.data.isFollowing;
  } catch (error) {
    console.error('Error checking follow status:', error);
    throw error;
  }
};


// Follow a user
export const followUser = async (id: string, token: string): Promise<void> => {
  try {
    const response =  await api.post(
      `/api/users/:id/follow`,
      { id }, // Sending `id` in the request body
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


// Unfollow a user
export const unfollowUser = async (id: string,token:string): Promise<void> => { 
  console.log("🚀 ~ unfollowUser ~ token:", token)
  console.log("🚀 ~ unfollowUser ~ id:", id)
  try {
    const response =  await api.post(
      `/api/users/:id/unfollow`,
      { id }, // Sending `id` in the request body
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