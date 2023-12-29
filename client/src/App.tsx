import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './Components/Login';
import RegistrationPage from './Components/Registration';
import HomePage from './Components/Home';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />}/>
        <Route path="/registration" element={<RegistrationPage />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </Router>
  );
};

export default App;