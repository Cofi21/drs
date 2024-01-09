import { useAuth } from "./AuthContext";
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom'; 

function UserSection(){
     const { user, logout } = useAuth();

     const navigate = useNavigate();

     const handleChange = () => {
      navigate('userInfo');
     }
     return( 
     <div className="auth-buttons">
     {user ? (
          <div>
            <h2>Dobrodošao, {user.username}!</h2>
            <button className="auth-btn" onClick={logout}>Log out</button>
            <button className="auth-btn" onClick={handleChange}>Change</button>
         </div>
     ) : (
       <div className="auth-buttons-left">
         <Link to="/login" className="auth-btn">Login</Link>
         <Link to="/registration" className="auth-btn">Register</Link>
       </div>
     )}
   </div>)
}

export default UserSection;