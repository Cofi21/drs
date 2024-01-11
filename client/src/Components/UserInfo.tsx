import { useState, useEffect } from 'react';
import '../Styles/user_info.css';
import { useNavigate } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { useAuth } from "./AuthContext";

function UserInfoPage() {

    const { id } = useParams(); // Change 'email' to 'id'
    const navigate = useNavigate();

    const [userData, setUserData] = useState({
      firstName: '',
      lastName: '',
      address: '',
      city: '',
      country: '',
      phoneNumber: '',
      email: '',
      password: '',
    });

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await fetch(`http://localhost:3003/auth/userInfo/${id}`);
                if (!response.ok) {
                    if (response.status === 404) {
                        console.log('User not found'); // Log or handle 404
                    } else {
                        throw new Error(`Error: ${response.status} - ${response.statusText}`);
                    }
                }
    
                const data = await response.json();
                console.log('Received data:', data); // Log received data
                setUserData(data);
            } catch (error) {
                console.error('Error fetching user data', error);
            }
        };
    
        fetchUserData();
    }, [id]);

    const handleCancel = () => {
      navigate('/');
    };

    const handleSave = async () => {
  try {
    const response = await fetch(`http://localhost:3003/auth/userInfo/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status} - ${response.statusText}`);
    }

    const updatedUserData = await response.json();
    console.log('User data updated successfully:', updatedUserData);

    // You may want to update the local state with the updated data if needed
    setUserData(updatedUserData);

    // Optionally, redirect the user to another page or perform any other actions
    navigate('/');
  } catch (error) {
    console.error('Error updating user data', error);
  }
};

  return (
    <div className="container">
      <h1>User info</h1>

      <form className="registration-form">
        <div className="input-wrapper">
          <label htmlFor="firstName">Name</label>
          <input
            className="input-login"
            type="text"
            name="firstName"
            placeholder="Enter your name"
            value={userData.firstName}
            onChange={(e) => setUserData({ ...userData, firstName: e.target.value })}  // Add this line
          />
        </div>
        <div className="input-wrapper">
          <label htmlFor="lastName">Last name</label>
          <input
            className="input-login"
            type="text"
            name="lastName"
            placeholder="Enter your last name"
            value={userData.lastName}
            onChange={(e) => setUserData({ ...userData, lastName: e.target.value })}  // Add this line
          />
        </div>
        <div className="input-wrapper">
          <label htmlFor="address">Address</label>
          <input
            className="input-login"
            type="text"
            name="address"
            placeholder="Enter your address"
            value={userData.address}
            onChange={(e) => setUserData({ ...userData, address: e.target.value })}  // Add this line
          />
        </div>
        <div className="input-wrapper">
          <label htmlFor="city">City</label>
          <input
            className="input-login"
            type="text"
            name="city"
            placeholder="Enter your city"
            value={userData.city}
            onChange={(e) => setUserData({ ...userData, city: e.target.value })}  // Add this line
          />
        </div>
        <div className="input-wrapper">
          <label htmlFor="country">Country</label>
          <input
            className="input-login"
            type="text"
            name="country"
            placeholder="Enter your country"
            value={userData.country}
            onChange={(e) => setUserData({ ...userData, country: e.target.value })}  // Add this line
          />
        </div>
        <div className="input-wrapper">
          <label htmlFor="phoneNumber">Phone number</label>
          <input
            className="input-login"
            type="tel"
            name="phoneNumber"
            placeholder="Enter your phone number"
            value={userData.phoneNumber}
            onChange={(e) => setUserData({ ...userData, phoneNumber: e.target.value })}  // Add this line
          />
        </div>
        <div className="input-wrapper">
          <label htmlFor="email">E-mail</label>
          <input
            className="input-login"
            type="email"
            name="email"
            placeholder="Enter your email"
            value={userData.email}
            onChange={(e) => setUserData({ ...userData, email: e.target.value })}  // Add this line
          />
        </div>
        <div className="input-wrapper">
          <label htmlFor="password">Password</label>
          <input
            className="input-login"
            type="password"
            name="password"
            placeholder="Enter your password"
            value={userData.password}
            onChange={(e) => setUserData({ ...userData, password: e.target.value })}  // Add this line
          />
        </div>
      </form>
      <div className="button-container">
        <button id="btn-save" onClick={handleSave} >Save</button>
        <button id="btn-cancel-save" onClick={handleCancel} >Cancel</button>
      </div>
    </div>
  );
}

export default UserInfoPage;
