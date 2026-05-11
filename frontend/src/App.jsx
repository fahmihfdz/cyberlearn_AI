import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import LandingPage from './pages/LandingPage';
import Auth from './pages/Auth';
import Dashboard from './pages/Dashboard';
import AiAssistant from './pages/AiAssistant';
import Roadmap from './pages/Roadmap';
import Quiz from './pages/Quiz';
import Summarizer from './pages/Summarizer';

function App() {
  return (
    <Router>
      <Routes>
        {/* Route untuk Landing Page tanpa Layout */}
        <Route path="/" element={<LandingPage />} />
        <Route path="/auth" element={<Auth />} />

        {/* Route lainnya menggunakan Layout sebagai pembungkus */}
        <Route
          path="/*"
          element={
            <Layout>
              <Routes>
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/assistant" element={<AiAssistant />} />
                <Route path="/roadmap" element={<Roadmap />} />
                <Route path="/quiz" element={<Quiz />} />
                <Route path="/summarizer" element={<Summarizer />} />
              </Routes>
            </Layout>
          }
        />
      </Routes>
    </Router>
  );
}

export default App;