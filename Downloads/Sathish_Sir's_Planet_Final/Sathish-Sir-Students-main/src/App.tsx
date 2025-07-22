import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navigation from './components/Navigation';
import Dashboard from './pages/Dashboard';
import HRDatabase from './pages/HRDatabase';
import AskQuestions from './pages/AskQuestions';
import RecentQuestions from './pages/RecentQuestions';
import ExpertAnswers from './pages/ExpertAnswers';
import JobOpenings from './pages/JobOpenings';
import CurrentJobs from './pages/CurrentJobs';
import { AppProvider } from './context/AppContext';

function App() {
  return (
    <AppProvider>
      <Router>
        <div className="min-h-screen bg-blue-50">
          <Navigation />
          <main className="container mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/hr-database" element={<HRDatabase />} />
              <Route path="/ask-questions" element={<AskQuestions />} />
              <Route path="/recent-questions" element={<RecentQuestions />} />
              <Route path="/expert-answers" element={<ExpertAnswers />} />
              <Route path="/job-openings" element={<JobOpenings />} />
              <Route path="/current-jobs" element={<CurrentJobs />} />
            </Routes>
          </main>
        </div>
      </Router>
    </AppProvider>
  );
}

export default App;