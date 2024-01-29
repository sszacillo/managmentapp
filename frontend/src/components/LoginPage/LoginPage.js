import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../LoginPage/LoginPage.css';
import Container from 'react-bootstrap/Container';
import Navbar from 'react-bootstrap/Navbar';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import { useNavigate } from 'react-router-dom';

axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';
axios.defaults.withCredentials = true;

const client = axios.create({
  baseURL: "http://127.0.0.1:8000"
});

function App() {

  const [currentUser, setCurrentUser] = useState();
  const [registrationToggle, setRegistrationToggle] = useState(false);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorAlert, setErrorAlert] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    client.get("/accounts/user")
      .then(function (res) {
        setCurrentUser(true);
      })
      .catch(function (error) {
        setCurrentUser(false);
      });
  }, []);

  function update_form_btn() {
    if (registrationToggle) {
      document.getElementById("form_btn").innerHTML = "Register";
      setRegistrationToggle(false);
    } else {
      document.getElementById("form_btn").innerHTML = "Log in";
      setRegistrationToggle(true);
    }
  }

  function displayErrorAlert(errorMessages) {
    setErrorAlert({ show: true, messages: errorMessages });

    setTimeout(() => {
      setErrorAlert({ show: false, messages: [] });
    }, 5000);
  }


  function submitRegistration(e) {
    e.preventDefault();
    if (!username || !password) {
      displayErrorAlert(["Username and password are required"]);
      return;
    }
    client.post(
      "/accounts/register",
      {
        username: username,
        password: password
      }
    ).then(function (res) {
      client.post(
        "/accounts/login",
        {
          username: username,
          password: password
        }
      ).then(function (res) {
        setCurrentUser(true);
      }).catch(function (error) {
        const errorMessages = error.response.data;
        displayErrorAlert(errorMessages);
      });
    }).catch(function (error) {
      const errorMessages = error.response.data;
      if (error.response && error.response.status === 400) {
        if (errorMessages && errorMessages.error && errorMessages.error.username) {
          const usernameErrors = errorMessages.error.username;
          if (Array.isArray(usernameErrors) && usernameErrors.includes("user with this username already exists.")) {
            displayErrorAlert(["Username is already taken"]);
            return;
          }
        }
      }
      displayErrorAlert(errorMessages);
    });

  }

  function submitLogin(e) {
    e.preventDefault();
    if (!username || !password) {
      displayErrorAlert(["Username and password are required"]);
      return;
    }
    client.post(
      "/accounts/login",
      {
        username: username,
        password: password
      }
    ).then(function (res) {
      setCurrentUser(true);
    }).catch(function (error) {
      const errorMessages = error.response.data;
      displayErrorAlert(errorMessages);
    });
  }

  if (currentUser) {
    return (navigate(`/projects`));
  }

  return (
    <div>
      <Navbar bg="dark" variant="dark">
        <Container>
          <Navbar.Brand>Project Management</Navbar.Brand>
          <Navbar.Toggle />
          <Navbar.Collapse className="justify-content-end">
            <Navbar.Text>
              <Button id="form_btn" onClick={update_form_btn} variant="light">Register</Button>
            </Navbar.Text>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      {
        registrationToggle ? (
          <div className="center d-flex align-items-center" style={{ marginTop: '0vh' }}>
            <Form onSubmit={e => submitRegistration(e)}>
              <Form.Group className="mb-1 text-center" controlId="formBasicTitle">
                <Form.Label className="label-styles">Registration</Form.Label>
              </Form.Group>
              <Form.Group className="mb-3" controlId="formBasicUsername">
                <Form.Label>Username</Form.Label>
                <Form.Control className="w-100" type="text" placeholder="Enter username" value={username} onChange={e => setUsername(e.target.value)} />
              </Form.Group>
              <Form.Group className="mb-3" controlId="formBasicPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control className="w-100" type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
              </Form.Group>
              <Button className="d-block mx-auto" variant="primary" type="submit">
                Submit
              </Button>
              <Form.Group className="mt-3" controlId="formBasicAlert">
                {errorAlert.show && (
                  <div className="alert alert-danger" role="alert">
                    {errorAlert.messages.map((message, index) => (
                      <p key={index}>{message}</p>
                    ))}
                  </div>
                )}
              </Form.Group>
            </Form>
          </div>
        ) : (
          <div className="center d-flex align-items-center" style={{ marginTop: '0vh' }}>
            <Form onSubmit={e => submitLogin(e)}>
              <Form.Group className="mb-1 text-center" controlId="formBasicTitle">
                <Form.Label className="label-styles">Login</Form.Label>
              </Form.Group>
              <Form.Group className="mb-3" controlId="formBasicUsername">
                <Form.Label>Username</Form.Label>
                <Form.Control className="w-100" type="text" placeholder="Enter username" value={username} onChange={e => setUsername(e.target.value)} />
              </Form.Group>
              <Form.Group className="mb-3" controlId="formBasicPassword">
                <Form.Label>Password</Form.Label>
                <Form.Control className="w-100" type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
              </Form.Group>
              <Button className="d-block mx-auto" variant="primary" type="submit">
                Submit
              </Button>
              <Form.Group className="mt-3" controlId="formBasicAlert">
                {errorAlert.show && (
                  <div className="alert alert-danger" role="alert">
                    {errorAlert.messages.map((message, index) => (
                      <p key={index}>{message}</p>
                    ))}
                  </div>
                )}
              </Form.Group>
            </Form>
          </div>
        )
      }
    </div>
  );
}

export default App;