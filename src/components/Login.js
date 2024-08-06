// Login.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../img/Aduan__1_-removebg-preview.png';
import { useUser } from './small-components/UserContext';
import './styling/Login.css';
import { loginUser, fetchUserData } from '../services/api';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { setUser } = useUser();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await loginUser({username, password})
      console.log("LOGINNN", response)
      localStorage.setItem('token', response.token);
      localStorage.setItem('currentUsername', username); 
       // Ambil data pengguna dari response atau panggil API untuk mendapatkannya
      const currentUser = response.user || await fetchUserData();

    // Setel user context dengan data pengguna yang masuk
      setUser(currentUser);
      navigate('/dashboard');

      window.location.reload();
    } catch (error) {
      console.error('Login error:', error);
      setError('An error occurred during login');
    }
  };

  return (
    <div className="login-body">
      <div>
        <img src={logo} alt="Logo" className="logo-login"/>
      </div>
      <div className="login-container">
        <h2>Login</h2>
        <form className="login-form" onSubmit={handleLogin}>
          <div>
            <label>Username:</label>
            <input 
              type="text" 
              value={username} 
              onChange={(e) => setUsername(e.target.value)} 
            />
          </div>
          <div>
            <label>Password:</label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
            />
          </div>
          {error && <p className="error-message">{error}</p>}
          <button type="submit">Login</button>
        </form>
      </div>
    </div>
  );
}

export default Login;
