import React, { createContext, useContext, useState, useEffect } from 'react';
import { fetchUsers } from "../../services/api";

// Buat konteks untuk pengguna
const UserContext = createContext();

// Hook untuk menggunakan konteks pengguna
export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Fungsi untuk mendapatkan pengguna saat ini dari localStorage
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        // const response = await fetchUsers();
        // const users = response.data;
  
        // Ambil username dari localStorage
        const currentUsername = localStorage.getItem('currentUsername');
        const username = localStorage.getItem('currentUser')
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  
        // Temukan pengguna yang sesuai dengan username
        // const currentUser = users.find(user => user.username === currentUsername);

  
        // if (username) {
        //   const currentUser = JSON.parse(username);
        //   setUser({
        //     // id: currentUser.id,
        //     username: currentUser.username,
        //     role: currentUser.role
        //   });
        // } else {
        //   console.error('User not found');
        // }
        if (currentUser && currentUser.username === currentUsername) {
          setUser({
            username: currentUser.username,
            role: currentUser.role
          });
        } else {
          console.error('User not found');
        }
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
  
    fetchCurrentUser();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};
