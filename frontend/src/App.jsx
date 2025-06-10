import { useState } from 'react';
import { AuthProvider } from './features/auth/AuthContext';
import Home from './pages/home/HomePage';
import Project from './pages/project/ProjectPage';

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
