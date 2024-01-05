import { useAuth } from "./AuthContext";
import { Link } from 'react-router-dom';

function UserSection(){
     const { user, logout } = useAuth();


     return( 
     <div className="auth-buttons">
     {user ? (
          <div>
            <h2>Dobrodošao, {user.username}!</h2>
            <button className="auth-btn" onClick={logout}>Izloguj se</button>
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