import { useState } from 'react';
import '../Styles/registration.css'; // Import your CSS file
import { useNavigate } from 'react-router-dom'; 

function RegistrationPage()  {
  // State to store registration data
  const [registrationData, setRegistrationData] = useState({
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    country: '',
    phoneNumber: '',
    email: '',
    password: '',
  });
  const navigate = useNavigate();

  const [registrationStatus, setRegistrationStatus] = useState('');

  // Function to handle input changes
  const handleInputChange = (e: { target: { name: any; value: any; }; }) => { // ovo se treba namestiti samo sam uradio ovako zbog push - a
    const { name, value } = e.target;
    setRegistrationData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Function to handle registration submission
  const handleRegistration = async () => {
    try {
      const response = await fetch('http://localhost:3003/auth/registration', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(registrationData),
      });

      console.log("response ", response)
      const data = await response.json();

      if (response.ok) {
        console.log('Registration successful:', data.message);
        navigate('/login');
        // Optionally, you can redirect to the login page or perform other actions
      } else {
        setRegistrationStatus(`Registration failed: ${data.message}`);
        console.error('Registration failed:', data.message);
        // Handle registration failure, show an error message, etc.
      }
    } catch (error) {
      console.error('Error during registration:', error);
      // Handle network or other errors during registration
    }
  };

  const handleCancel = () => {
    // Redirect to the home page or any other desired page on cancel
    navigate('/');
  };

  return (
    <div className="registration-container">
       <p id="naslov">Welcome to forum</p>
      <h2>Sign up</h2>
      <form className="registration-form">
        <input
          className="input-login"
          type="text"
          name="firstName"
          placeholder="Name"
          value={registrationData.firstName}
          onChange={handleInputChange}
        />
        <input
          className="input-login"
          type="text"
          name="lastName"
          placeholder="Last name"
          value={registrationData.lastName}
          onChange={handleInputChange}
        />
        <input
          className="input-login"
          type="text"
          name="address"
          placeholder="Address"
          value={registrationData.address}
          onChange={handleInputChange}
        />
        <input
          className="input-login"
          type="text"
          name="city"
          placeholder="City"
          value={registrationData.city}
          onChange={handleInputChange}
        />
        <input
          className="input-login"
          type="text"
          name="country"
          placeholder="Country"
          value={registrationData.country}
          onChange={handleInputChange}
        />
        <input
          className="input-login"
          type="tel"
          name="phoneNumber"
          placeholder="Phone number"
          value={registrationData.phoneNumber}
          onChange={handleInputChange}
        />
        <input
          className="input-login"
          type="email"
          name="email"
          placeholder="E-mail"
          value={registrationData.email}
          onChange={handleInputChange}
        />
        <input
          className="input-login"
          type="password"
          name="password"
          placeholder="Password"
          value={registrationData.password}
          onChange={handleInputChange}
        />
      </form>
      <div className="button-container">
        <button id="btn-reg" onClick={handleRegistration}>Sign up</button>
        <button id="btn-cancel" onClick={handleCancel}>Home</button>
      </div>
      <p>{registrationStatus}</p>
    </div>
  );
};

export default RegistrationPage;