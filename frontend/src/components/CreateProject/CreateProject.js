import React, { useState, useEffect } from 'react';
import { Form, Button, Card, Alert } from 'react-bootstrap';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const CreateProjectForm = () => {
  const [projectName, setProjectName] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [projectStartDate, setProjectStartDate] = useState('');
  const [projectEndDate, setProjectEndDate] = useState('');
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [availableUsers, setAvailableUsers] = useState([]);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersResponse = await axios.get('http://127.0.0.1:8000/accounts/all_users/');
        setAvailableUsers(usersResponse.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    fetchUsers();
  }, []);

  const getCookie = (name) => {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts.pop().split(';').shift();
  };

  const handleUserSelectionChange = (e) => {
    const selectedUsername = e.target.value;

    if (selectedUsername) {
      const selectedUser = availableUsers.find((user) => user.username === selectedUsername);

      if (selectedUser && selectedUser.user_id) {
        const selectedUserId = selectedUser.user_id;

        console.log('Selected User ID:', selectedUserId);

        if (!selectedUsers.some((user) => user.id === selectedUserId)) {
          setSelectedUsers((prevUsers) => [
            ...prevUsers,
            { id: selectedUserId, username: selectedUsername },
          ]);
        } else {
          console.warn('User already selected:', selectedUsername);
        }
      } else {
        console.error('Invalid User:', selectedUsername);
      }
    } else {
      console.error('Invalid User:', selectedUsername);
    }
  };

  const handleRemoveUser = (userId) => {
    setSelectedUsers((prevUsers) => prevUsers.filter((user) => user.id !== userId));
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = (`0${date.getMonth() + 1}`).slice(-2);
    const day = (`0${date.getDate()}`).slice(-2);
    return `${year}-${month}-${day}`;
  };

  const handleCreateProject = async () => {
    try {
      const csrftoken = getCookie('csrftoken');

      if (!projectName || !projectDescription || !projectStartDate || !projectEndDate) {
        setError('Please fill in all project details.');
        return;
      }

      const formattedStartDate = formatDate(projectStartDate);
      const formattedEndDate = formatDate(projectEndDate);

      console.log('Request Data:', {
        id: null,
        project_name: projectName,
        project_description: projectDescription,
        project_start_date: formattedStartDate,
        project_end_date: formattedEndDate,
        project_users: selectedUsers.map((user) => user.id),
      });

      const response = await axios.post(
        'http://127.0.0.1:8000/projects/create/',
        {
          id: null,
          project_name: projectName,
          project_description: projectDescription,
          project_start_date: formattedStartDate,
          project_end_date: formattedEndDate,
          project_users: selectedUsers.map((user) => user.id),
        },
        {
          withCredentials: true,
          headers: {
            'X-CSRFToken': csrftoken,
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.status === 201) {
        console.log('Project created successfully:', response.data);
        setProjectName('');
        setProjectDescription('');
        setProjectStartDate('');
        setProjectEndDate('');
        setSelectedUsers([]);
        setError(null);
        setSuccessMessage('Project created successfully.');

        // Automatyczne przekierowanie po kilku sekundach
        setTimeout(() => {
          setSuccessMessage(null);
          navigate('/projects');
        }, 3000);
      } else {
        console.error('Error creating project. Status:', response.status);
        console.error('Response data:', response.data);
        setError('Error creating project. Please check the form data.');
      }
    } catch (error) {
      console.error('Error creating project:', error);
      setError('Error creating project. Please try again.');
    }
  };

  return (
    <Card className="m-4">
      <Card.Body>
        {error && <Alert variant="danger">{error}</Alert>}
        {successMessage && <Alert variant="success">{successMessage}</Alert>}

        <Form>
          <Form.Group controlId="projectName">
            <Form.Label>Project Name:</Form.Label>
            <Form.Control
              className='mb-3'
              type="text"
              placeholder="Enter project name"
              value={projectName}
              onChange={(e) => setProjectName(e.target.value)}
            />
          </Form.Group>

          <Form.Group controlId="projectDescription">
            <Form.Label>Project Description:</Form.Label>
            <Form.Control
              className='mb-3'
              type="text"
              placeholder="Enter project description"
              value={projectDescription}
              onChange={(e) => setProjectDescription(e.target.value)}
            />
          </Form.Group>

          <Form.Group controlId="projectStartDate">
            <Form.Label>Project Start Date:</Form.Label>
            <Form.Control
              className='mb-3'
              type="date"
              value={projectStartDate}
              onChange={(e) => setProjectStartDate(e.target.value)}
            />
          </Form.Group>

          <Form.Group controlId="projectEndDate">
            <Form.Label>Project End Date:</Form.Label>
            <Form.Control
              className='mb-3'
              type="date"
              value={projectEndDate}
              onChange={(e) => setProjectEndDate(e.target.value)}
            />
          </Form.Group>

          <Form.Group controlId="projectUsers">
            <Form.Label>Select Users:</Form.Label>
            <Form.Control
              className='mb-3'
              as="select"
              multiple
              value={selectedUsers.map((user) => user.username)}
              onChange={handleUserSelectionChange}
            >
              {availableUsers.map((user) => (
                <option key={user.user_id} value={user.username}>
                  {user.username}
                </option>
              ))}
            </Form.Control>
          </Form.Group>

          <Form.Group controlId="selectedUsers">
            <Form.Label>Selected Users:</Form.Label>
            <ul>
              {selectedUsers.map((user) => (
                <li key={user.id}>
                  {user.username}
                  <Button
                    variant="outline-danger"
                    size="sm"
                    onClick={() => handleRemoveUser(user.id)}
                    style={{ marginLeft: '1rem' }}
                  >
                    Remove
                  </Button>
                </li>
              ))}
            </ul>
          </Form.Group>

          <Button variant="primary" onClick={handleCreateProject}>
            Create Project
          </Button>
        </Form>
      </Card.Body>
    </Card>
  );
};

export default CreateProjectForm;
