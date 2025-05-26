import { useState } from 'react';
import Home from './views/home/Home';
import Project from './views/project/Project';

function App() {
  const [currentView, setCurrentView] = useState("home");
  const [currentProjectId, setCurrentProjectId] = useState(null);

  const handleProjectCreated = (projectId) => {
    setCurrentProjectId(projectId);
    setCurrentView("project");
  };

  if (currentView === "project" && currentProjectId) {
    return <Project projectId={currentProjectId} />;
  }

  return <Home onProjectCreated={handleProjectCreated} />;
}

export default App;