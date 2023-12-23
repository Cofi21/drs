// Import necessary dependencies
import React, { useState } from 'react';
import '../Styles/login.css';
import { useNavigate } from 'react-router-dom';



// Functional component for the login form
const LandingPage = () => {
  // State to store user credentials
  const [credentials, setCredentials] = useState({
    username: '',
    password: '',
  });

  // State to store login status
  const [loginStatus, setLoginStatus] = useState('');
  const navigate = useNavigate();

  // Function to handle input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCredentials((prevCredentials) => ({
      ...prevCredentials,
      [name]: value,
    }));
  };

  const handleRegistration = () => {
    // Redirect to the registration page
    navigate('/registration');
  };


  // Function to handle login submission
// Function to handle login submission
const handleLogin = async () => {
  try {
    const response = await fetch('http://localhost:3003/login', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
});



    const data = await response.json();

    if (response.ok) {
      setLoginStatus('Login successful');
      // You can redirect the user or perform other actions here
    } else {
      setLoginStatus(`Login failed: ${data.message}`);
    }
  } catch (error) {
    console.error('Error during login:', error);
  }
};


  return (
<div class="login-container">
  <p id="naslov">Dobro došli na forum</p>
  <h2>Prijava</h2>
  <br/>
  <form class="login-form">
    <input 
    class="input-login"
      type="text"
      name="username"
      placeholder="Email"
      value={credentials.username}
      onChange={handleInputChange}
    />
    <br/>
    <input
    class="input-login"
      type="password"
      name="password"
      placeholder="Lozinka"
      value={credentials.password}
      onChange={handleInputChange}
    />
  </form>
  <div class="button-container">
    <button id="login-btn" onClick={handleLogin}>Prijava</button>
    <button id="register-btn" onClick={handleRegistration}>Registracija</button>
  </div>
  <p>{loginStatus}</p>
</div>


  );
};

export default LandingPage;
