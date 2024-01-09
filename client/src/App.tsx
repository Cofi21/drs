import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './Components/Login';
import RegistrationPage from './Components/Registration';
import HomePage from './Components/Home';
import { AuthProvider } from './Components/AuthContext';
import UserInfoPage from './Components/UserInfo';


const App = () => {
  return (
    <Router>
      <AuthProvider>
        <Routes >
          <Route path="/" element={<HomePage />}/>
          <Route path="/registration" element={<RegistrationPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path='/userInfo' element={<UserInfoPage/>}/>
        </Routes>
      </AuthProvider>
    </Router>
  );
};

export default App;