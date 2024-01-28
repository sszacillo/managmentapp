// App.js

import React, { useState } from 'react';
import axios from 'axios';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button';
import { useNavigate, Routes, Route } from 'react-router-dom';
import LoginPage from './components/LoginPage/LoginPage';
import RegistrationPage from './components/RegistrationPage/RegistrationPage';
import ProjectPage from './components/ProjectPage/ProjectPage'; // Adjust the import based on your project structure

axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';
axios.defaults.withCredentials = true;

const client = axios.create({
  baseURL: "http://127.0.0.1:8000",
  withCredentials: true,
  credentials: 'include',
});

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();

  const onLogin = (userData) => {
    setCurrentUser(userData);
  };

  const submitLogout = async (e) => {
    e.preventDefault();
    try {
      await client.post('/accounts/logout');
      console.log('Logout successful');
      setCurrentUser(null);
      navigate('/');
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  return (
    <div>
      <Navbar bg="dark" variant="dark">
        <Container>
          <Navbar.Brand>Project Management</Navbar.Brand>
          <Navbar.Toggle />
          <Navbar.Collapse className="justify-content-end">
            <Navbar.Text>
              {currentUser ? (
                <>
                  <form onSubmit={submitLogout}>
                    <Button type="submit" variant="light">
                      Log out
                    </Button>
                  </form>
                  <Button variant="light" onClick={() => navigate('/projects')}>
                    Projects
                  </Button>
                </>
              ) : (
                <>
                  <Button variant="light" onClick={() => navigate('/login')}>
                    Log in
                  </Button>
                  <Button variant="light" onClick={() => navigate('/register')}>
                    Register
                  </Button>
                </>
              )}
            </Navbar.Text>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <Container>
        <Routes>
          <Route path="/" element={<LoginPage onLogin={onLogin} />} />
          <Route path="/register" element={<RegistrationPage />} />
          <Route
            path="/projects"
            element={<ProjectPage currentUser={currentUser} />}
          />
        </Routes>
      </Container>
    </div>
  );
}

export default App;
