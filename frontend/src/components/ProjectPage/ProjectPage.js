import React, { useState, useEffect } from 'react';
import { Card, Button } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from 'react-bootstrap/Navbar';
import Container from 'react-bootstrap/Container';
import axios from "axios";

const ProjectsList = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState(null);
  const navigate = useNavigate();

  const fetchProjects = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/projects/projectlist', {
        credentials: 'include',
      });
      const data = await response.json();

      if (Array.isArray(data)) {
        setProjects(data);
        console.log('Received projects data:', data);
      } else {
        console.error('Invalid projects data received:', data);
      }

      setLoading(false);
      const userRoleResponse = await axios.get(
        "http://127.0.0.1:8000/accounts/get_user_role"
      );
      setUserRole(userRoleResponse.data.role);
    } catch (error) {
      console.error('Error fetching projects:', error);
      setLoading(false);
    }
    
    
  };

  const handleGoToProject = (projectId) => {
    navigate(`/projects/${projectId}/details`);
  };

  const handleDeleteProject = async (projectId) => {
    try {
      await fetch(`http://127.0.0.1:8000/projects/${projectId}/delete`, {
        method: 'DELETE',
        credentials: 'include',
      });

      // Refresh the project list after deletion
      fetchProjects();
    } catch (error) {
      console.error(`Error deleting project ${projectId}:`, error);
    }
  };

  const submitLogout = async () => {
    try {
      await fetch('http://127.0.0.1:8000/accounts/logout', {
        method: 'POST',
        credentials: 'include',
      });

      // Przekieruj użytkownika do sekcji logowania
      navigate('/');
    } catch (error) {
      console.error('Error during logout:', error);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  return (
    <div>
      <Navbar bg="dark" variant="dark">
        <Container>
          <Navbar.Brand>Project Management - Project List</Navbar.Brand>
          <Navbar.Toggle />
          <Navbar.Collapse className="justify-content-end">
            <Link to="/projects/notifications" className="btn btn-light m-2">
              Notifications
            </Link>
            <Link to="/projects/create" className="btn btn-light m-2">
              Create Project
            </Link>
            <Navbar.Text style={{ marginLeft: '5%' }}>
              <Button onClick={submitLogout} variant="light">
                Log out
              </Button>
            </Navbar.Text>
          </Navbar.Collapse>
        </Container>
      </Navbar>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {loading ? (
          <Card style={{ marginTop: '5%' }}>
            <Card.Body>
              <Card.Text className="text-center">Loading projects...</Card.Text>
            </Card.Body>
          </Card>
        ) : (
          projects.length === 0 ? (
            <Card style={{ marginTop: '5%' }}>
              <Card.Body>
                <Card.Text className="text-center">No projects available.</Card.Text>
              </Card.Body>
            </Card>
          ) : (
            <>
              {projects.map((project) => (
              <Card key={project.id} style={{ width: '90%', margin: '2%' }}>
              <Card.Body>
                <Card.Title>{project.project_name}</Card.Title>
                <Card.Text>From {project.project_start_date} to {project.project_end_date}</Card.Text>
                <Card.Text>{project.project_description}</Card.Text>
                <div className="d-flex justify-content-between align-items-center">
                  <Button variant="primary" onClick={() => handleGoToProject(project.id)}>
                    Go to Project
                  </Button>
                  {userRole === "L" && (
                  <Button variant="danger" onClick={() => handleDeleteProject(project.id)}>
                    Delete Project
                  </Button>
                  )}
                </div>
              </Card.Body>
            </Card>
              ))}
            </>
          )
        )}
      </div>
    </div>
  );
};

export default ProjectsList;
