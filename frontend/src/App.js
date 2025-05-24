import './App.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Home from './views/home/Home';
import Project from './views/projects/Project';

function App() {
  return(
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/projects" element={<Project />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
