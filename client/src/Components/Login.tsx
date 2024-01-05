import { useState } from 'react';
import '../Styles/login.css';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './AuthContext';


// Functional component for the login form
function LoginPage() {

  const { login } = useAuth();


  const [credentials, setCredentials] = useState({
    username: '',
    password: '',
  });

  const [loginStatus, setLoginStatus] = useState('');
  const navigate = useNavigate();

  const handleInputChange = (e: { target: { name: any; value: any; }; }) => { // isto ko i na registration
    const { name, value } = e.target;
    setCredentials((prevCredentials) => ({
      ...prevCredentials,
      [name]: value,
    }));
  };

  const handleRegistration = () => {
    navigate('/registration');
  };

  const handleCancel = () => {
    // Redirect to the homepage
    navigate('/');
  };

  const handleLogin = async () => {
    try {
      const response = await fetch('http://localhost:3003/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(credentials),
      });

      console.log("response ", response )
      const data = await response.json();

      if (response.ok) {
        const userData = { username: credentials.username };
        login(userData);    
        navigate('/');
      } else {
        setLoginStatus(`Login failed: ${data.message}`);
      }
    } catch (error) {
      console.error('Error during login:', error);
    }
  };



  return (
    <div className="login-container">
      <p id="naslov">Dobro došli na forum</p>
      <h2>Prijava</h2>
      <br />
      <form className="login-form">
        <input
          className="input-login"
          type="text"
          name="username"
          placeholder="Email"
          value={credentials.username}
          onChange={handleInputChange}
        />
        <br />
        <input
          className="input-login"
          type="password"
          name="password"
          placeholder="Lozinka"
          value={credentials.password}
          onChange={handleInputChange}
        />
      </form>
      <div className="button-container">
        <button id="login-btn" onClick={handleLogin}>
          Prijava
        </button>
        <button id="register-btn" onClick={handleRegistration}>
          Registracija
        </button>
        <button id="cancel-btn" onClick={handleCancel}>
          Odustani
        </button>
      </div>
      <p>{loginStatus}</p>
    </div>
  );
};

export default LoginPage;