import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './Components/Login';
import RegistrationPage from './Components/Registration';
import HomePage from './Components/Home';
import { AuthProvider } from './Components/AuthContext';


const App = () => {
  return (
    <Router>
      <AuthProvider>
        <Routes >
          <Route path="/" element={<HomePage />}/>
          <Route path="/registration" element={<RegistrationPage />} />
          <Route path="/login" element={<LoginPage />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
};

export default App;