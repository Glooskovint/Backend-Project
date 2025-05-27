import { useState } from 'react';
import { AuthProvider } from './contexts/AuthContext';
import Home from './views/home/Home';
import Project from './views/project/Project';

function App() {
  const [currentView, setCurrentView] = useState('home');
  const [currentProjectId, setCurrentProjectId] = useState(null);

  const handleProjectCreated = (projectId) => {
    setCurrentProjectId(projectId)
    setCurrentView('project');
  };

  return (
    <AuthProvider>
      {currentView === 'project' && currentProjectId ? (
        <Project projectId={currentProjectId} />
      ) : (
        <Home onProjectCreated={handleProjectCreated} />
      )}
    </AuthProvider>
  );
}

export default App;
