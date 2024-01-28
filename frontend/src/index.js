import React from 'react';
import { createRoot } from 'react-dom';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './components/LoginPage/LoginPage';
import ProjectsList from './components/ProjectPage/ProjectPage';
import ProjectDetails from './components/ProjectDetail/ProjectDetails'; // Import the new component
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const root = createRoot(document.getElementById('root'));

root.render(
  <Router>
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/projects" element={<ProjectsList />} />
      <Route path="/projects/:id/details" element={<ProjectDetails />} /> {/* Add the new route for project details */}
    </Routes>
  </Router>
);
