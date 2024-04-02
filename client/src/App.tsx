import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Navbar from './components/NavBar'
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import MainPage from './pages/MainPage';

// Import other pages you have

function App() {
  return (
    <Router>
      <div>
        {/* Navbar will always be rendered, regardless of the route */}
        <Navbar />
        {/* Page content will change based on the route */}
        <Routes>
          <Route path="/" element={<MainPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          {/* Define other routes/pages as needed */}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
