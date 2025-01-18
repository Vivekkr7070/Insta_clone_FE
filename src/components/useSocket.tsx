import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

// Replace this with your server's endpoint
const SERVER_URL = 'http://localhost:5000';

export const useSocket = (): Socket | null => {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    // Get the token from localStorage for authentication
    const token = localStorage.getItem('authToken'); // Assuming JWT is stored in localStorage
    if (!token) {
      console.error('No token found for socket authentication');
      return;
    }

    // Initialize the socket connection with the authentication token
    const newSocket = io(SERVER_URL, {
      auth: { token },
    });

    // Log socket connection and errors
    newSocket.on('connect', () => {
      console.log('Socket connected:', newSocket.id);
    });

    newSocket.on('connect_error', (err: Error) => {
      console.error('Socket connection error:', err.message);
    });

    newSocket.on('disconnect', () => {
      console.log('Socket disconnected');
    });

    // Handle incoming messages
    newSocket.on('receive_message', (message: { from: string; content: string }) => {
      console.log('Received message:', message);
    });

    // Handle notifications when a user is offline
    newSocket.on('user_offline', (notification: string) => {
      console.warn('User offline:', notification);
    });

    // Save the socket instance in state
    setSocket(newSocket);

    // Cleanup the socket connection when the component is unmounted
    return () => {
      newSocket.disconnect();
      console.log('Socket disconnected on unmount');
    };
  }, []);

  return socket;
};