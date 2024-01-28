// LoginPage.js

import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { useNavigate } from 'react-router-dom';

const LoginPage = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulating successful login for demonstration purposes
    // In a real application, you would perform actual authentication here
    const userData = { username, sessionid: '123' };
    onLogin(userData);
    navigate('/projects'); // Redirect to the projects view
  };

  return (
    <div className="center">
      <Form onSubmit={handleSubmit}>
        <Form.Label style={labelStyles}>Login</Form.Label>
        <Form.Group className="mb-3" controlId="formBasicUsername">
          <Form.Label>Username</Form.Label>
          <Form.Control type="text" placeholder="Enter username" value={username} onChange={(e) => setUsername(e.target.value)} />
        </Form.Group>
        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Label>Password</Form.Label>
          <Form.Control type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
        </Form.Group>
        <Button variant="primary" type="submit">
          Submit
        </Button>
      </Form>
    </div>
  );
};

const labelStyles = {
  fontSize: '18px',
  fontWeight: 'bold',
};

export default LoginPage;
