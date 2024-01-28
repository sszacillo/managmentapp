import React, { useState, useEffect } from 'react';
import { Card, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';  // Use useNavigate instead of useHistory

const ProjectsList = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();  // Use useNavigate instead of useHistory

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
    } catch (error) {
      console.error('Error fetching projects:', error);
      setLoading(false);
    }
  };

  const handleGoToProject = (projectId) => {
    navigate(`/projects/${projectId}/details`);  // Use navigate instead of history.push
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <h2>Projects List</h2>
      {loading ? (
        <p>Loading...</p>
      ) : (
        projects.map((project) => (
          <Card key={project.id} style={{ width: '18rem', margin: '10px' }}>
            <Card.Body>
              <Card.Title>{project.project_name}</Card.Title>
              <Card.Text>{project.project_description}</Card.Text>
              <Card.Text>Project start: {project.project_start_date}</Card.Text>
              <Card.Text>Project end: {project.project_end_date}</Card.Text>
              <Button variant="primary" onClick={() => handleGoToProject(project.id)}>
                Go to Project
              </Button>
            </Card.Body>
          </Card>
        ))
      )}
    </div>
  );
};

export default ProjectsList;
