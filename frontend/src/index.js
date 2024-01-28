import React from 'react';
import { createRoot } from 'react-dom';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './components/LoginPage/LoginPage';
import ProjectsList from './components/ProjectPage/ProjectPage';
import ProjectDetails from './components/ProjectDetail/ProjectDetails';
import CreateProject from './components/CreateProject/CreateProject'
import './index.css';
import 'bootstrap/dist/css/bootstrap.min.css';

const root = createRoot(document.getElementById('root'));

root.render(
  <Router>
    <Routes>
      <Route path="/" element={<LoginPage />} />
      <Route path="/projects" element={<ProjectsList />} />
      <Route path="/projects/:id/details" element={<ProjectDetails />} /> 
      <Route path="/projects/create" element={<CreateProject />} />
    </Routes>
  </Router>
);
