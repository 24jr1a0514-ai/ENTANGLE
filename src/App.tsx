
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { LearningPathProvider } from './contexts/LearningPathContext';
import { ProtectedRoute, PublicRoute } from './components/ProtectedRoute';

import DashboardLayout from './layouts/DashboardLayout';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import DashboardPage from './pages/DashboardPage';
import LearningPathSelection from './pages/LearningPathSelection';

import ChapterPage from './pages/ChapterPage';
import TopicPage from './pages/TopicPage';
import AiTutorPage from './pages/AiTutorPage';
import CurriculumPage from './pages/CurriculumPage';
import QuizPage from './pages/QuizPage';
import ProjectsPage from './pages/ProjectsPage';
import InterviewQuestionsPage from './pages/InterviewQuestionsPage';

import QuantumLabPage from './pages/QuantumLabPage';
import CodingSandboxPage from './pages/CodingSandboxPage';
import PracticeCodePage from './pages/PracticeCodePage';

import SettingsPage from './pages/SettingsPage';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <LearningPathProvider>
          <Routes>
            <Route path="/" element={<PublicRoute><LandingPage /></PublicRoute>} />
            <Route path="/login" element={<PublicRoute><LoginPage /></PublicRoute>} />
            <Route path="/signup" element={<PublicRoute><SignupPage /></PublicRoute>} />
            <Route path="/select-learning-path" element={<ProtectedRoute><LearningPathSelection /></ProtectedRoute>} />

            
            <Route element={<ProtectedRoute><DashboardLayout /></ProtectedRoute>}>
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/chapter/:chapterId" element={<ChapterPage />} />
              <Route path="/topic/:chapterId/:topicId" element={<TopicPage />} />
              <Route path="/ai-tutor" element={<AiTutorPage />} />
              <Route path="/curriculum" element={<CurriculumPage />} />
              <Route path="/quizzes/:lessonId" element={<QuizPage />} />
              <Route path="/quantum-lab" element={<QuantumLabPage />} />
              <Route path="/coding" element={<CodingSandboxPage />} />
              <Route path="/practice/:courseId" element={<PracticeCodePage />} />
              <Route path="/interview-questions" element={<InterviewQuestionsPage />} />
              <Route path="/lessons" element={<div className="p-8">All Lessons (Coming Soon)</div>} />
              <Route path="/projects" element={<ProjectsPage />} />


              <Route path="/settings" element={<SettingsPage />} />
            </Route>
          </Routes>
        </LearningPathProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
