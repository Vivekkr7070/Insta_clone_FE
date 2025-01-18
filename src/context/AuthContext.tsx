import React, { createContext, useState, useEffect } from "react";
import { io, Socket } from "socket.io-client";

interface AuthContextType {
  token: string | null;
  userId: string | null;
  socket: Socket | null;
  isConnected: boolean; // Add this line
  setAuthData: (token: string, userId: string) => void;
  logout: () => void;
}

export const AuthContext = createContext<AuthContextType>({
  token: null,
  userId: null,
  socket: null,
  isConnected: false,
  setAuthData: () => {},
  logout: () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("authToken")
  );
  const [userId, setUserId] = useState<string | null>(
    localStorage.getItem("userId")
  );
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  const setAuthData = (newToken: string, newUserId: string) => {
    setToken(newToken);
    setUserId(newUserId);
    localStorage.setItem("authToken", newToken);
    localStorage.setItem("userId", newUserId);
  };

  const logout = () => {
    if (socket) {
      socket.disconnect(); // Properly disconnect the socket
    }
    setToken(null);
    setUserId(null);
    setSocket(null);
    localStorage.removeItem("authToken");
    localStorage.removeItem("userId");
  };

  // useEffect(() => {
  //   if (token) {
  //     const newSocket = io("http://localhost:6001", {
  //       auth: { token },
  //     });

  //     newSocket.on("connect", () => {
  //       setIsConnected(true);
  //     });

  //     newSocket.on("disconnect", () => {
  //       setIsConnected(false);
  //     });

  //     setSocket(newSocket);

  //     return () => {
  //       newSocket.disconnect();
  //     };
  //   }
  // }, [token]);

  // AuthContext.tsx

  useEffect(() => {
    if (token) {
      const newSocket = io("http://localhost:6001", {
        auth: { token },
        transports: ["websocket"],
        autoConnect: true,
      });

      newSocket.on("connect", () => {
        console.log("Socket connected:", newSocket.id);
        setIsConnected(true);
      });

      newSocket.on("connect_error", (error) => {
        console.error("Socket connection error:", error);
        setIsConnected(false);
      });

      setSocket(newSocket);

      return () => {
        newSocket.disconnect();
      };
    }
  }, [token]);

  return (
    <AuthContext.Provider
      value={{ token, userId, socket, setAuthData, logout, isConnected }}
    >
      {children}
    </AuthContext.Provider>
  );
};
