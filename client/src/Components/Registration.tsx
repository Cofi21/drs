import { useState } from 'react';
import '../Styles/registration.css';
import { useNavigate } from 'react-router-dom';

interface RegistrationData {
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  country: string;
  phoneNumber: string;
  email: string;
  password: string;
}

function RegistrationPage() {
  const [registrationData, setRegistrationData] = useState<RegistrationData>({
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    country: '',
    phoneNumber: '',
    email: '',
    password: '',
  });
  const [registrationStatus, setRegistrationStatus] = useState('');
  const navigate = useNavigate();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setRegistrationData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const validateInputs = () => {
    const { firstName, lastName, address, city, country, phoneNumber, email, password } = registrationData;

    if (!firstName || !lastName || !address || !city || !country || !phoneNumber || !email || !password) {
      setRegistrationStatus('Please fill in all fields.');
      return false;
    }

    // You can add more specific validation rules for each field if needed

    return true;
  };

  const handleRegistration = async () => {
    if (!validateInputs()) {
      return; // Do not proceed with registration if validation fails
    }

    try {
      const response = await fetch('http://localhost:3003/auth/registration', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify(registrationData),
      });

      const data = await response.json();

      if (response.ok) {
        console.log('Registration successful:', data.message);
        navigate('/login');
      } else {
        setRegistrationStatus(`Registration failed: ${data.message}`);
        console.error('Registration failed:', data.message);
      }
    } catch (error) {
      console.error('Error during registration:', error);
    }
  };

  const handleCancel = () => {
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
        <button id="btn-reg" onClick={handleRegistration}>
          Sign up
        </button>
        <button id="btn-cancel" onClick={handleCancel}>
          Home
        </button>
      </div>
      <p> {registrationStatus}</p>
    </div>
  );
}

export default RegistrationPage;
