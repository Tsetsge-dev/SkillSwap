import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';

// Components
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ChatBotWidget from './components/ChatBotWidget';
import IncomingCallAlert from './components/IncomingCallAlert';
import VideoCallModal from './components/VideoCallModal';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Home from './pages/Home';
import Explore from './pages/Explore';
import Assessment from './pages/Assessment';
import ChatbotPage from './pages/ChatbotPage';
import RequestsPage from './pages/RequestsPage';
import ChatPage from './pages/ChatPage';
import SessionsPage from './pages/SessionsPage';
import ProfilePage from './pages/ProfilePage';
import UserProfileDetail from './pages/UserProfileDetail';
import Login from './pages/Login';
import Register from './pages/Register';
import SurveyProfiles from './pages/SurveyProfiles';
import SkillRecommendations from './pages/SkillRecommendations';

function AppContent() {
  const [activeCallPartner, setActiveCallPartner] = useState(null);
  const location = useLocation();
  const isAuthPage = ['/login', '/register'].includes(location.pathname);

  const handleAcceptIncomingCall = (partner) => {
    setActiveCallPartner(partner);
  };

  return (
    <div className="min-h-screen flex flex-col text-slate-800 selection:bg-violet-500/30 selection:text-black">
      {!isAuthPage && <Navbar />}

      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/explore" element={<Explore />} />
          <Route path="/assessment" element={<Assessment />} />
          <Route path="/recommendations" element={<SkillRecommendations />} />
          <Route path="/chatbot" element={<ChatbotPage />} />
          <Route path="/users/:userId" element={<UserProfileDetail />} />
          
          <Route
            path="/requests"
            element={
              <ProtectedRoute>
                <RequestsPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/chat"
            element={
              <ProtectedRoute>
                <ChatPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/sessions"
            element={
              <ProtectedRoute>
                <SessionsPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />

          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/survey-examples" element={<SurveyProfiles />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {!isAuthPage && <Footer />}

      {/* Global Floating AI Chatbot Widget */}
      {!isAuthPage && <ChatBotWidget />}

      {/* Global Incoming Call Alert */}
      {!isAuthPage && <IncomingCallAlert onAcceptCall={handleAcceptIncomingCall} />}

      {/* Active Received Video Call */}
      {!isAuthPage && activeCallPartner && (
        <VideoCallModal
          partner={activeCallPartner}
          isCaller={false}
          onClose={() => setActiveCallPartner(null)}
        />
      )}
    </div>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <SocketProvider>
          <AppContent />
        </SocketProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
