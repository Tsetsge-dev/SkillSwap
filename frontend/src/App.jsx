import React, { useState } from 'react';
<<<<<<< HEAD
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
=======
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
>>>>>>> 2a62fa6b7a13aa05662930812d05cb32d53c64e0
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
<<<<<<< HEAD
=======
import Assessment from './pages/Assessment';
>>>>>>> 2a62fa6b7a13aa05662930812d05cb32d53c64e0
import ChatbotPage from './pages/ChatbotPage';
import RequestsPage from './pages/RequestsPage';
import ChatPage from './pages/ChatPage';
import SessionsPage from './pages/SessionsPage';
import ProfilePage from './pages/ProfilePage';
import UserProfileDetail from './pages/UserProfileDetail';
import Login from './pages/Login';
import Register from './pages/Register';
<<<<<<< HEAD
=======
import SurveyProfiles from './pages/SurveyProfiles';
>>>>>>> 2a62fa6b7a13aa05662930812d05cb32d53c64e0
import SkillRecommendations from './pages/SkillRecommendations';

function AppContent() {
  const [activeCallPartner, setActiveCallPartner] = useState(null);
<<<<<<< HEAD
=======
  const location = useLocation();
  const isAuthPage = ['/login', '/register'].includes(location.pathname);
>>>>>>> 2a62fa6b7a13aa05662930812d05cb32d53c64e0

  const handleAcceptIncomingCall = (partner) => {
    setActiveCallPartner(partner);
  };

  return (
    <div className="min-h-screen flex flex-col text-slate-800 selection:bg-violet-500/30 selection:text-black">
<<<<<<< HEAD
      <Navbar />
=======
      {!isAuthPage && <Navbar />}
>>>>>>> 2a62fa6b7a13aa05662930812d05cb32d53c64e0

      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/explore" element={<Explore />} />
<<<<<<< HEAD
=======
          <Route path="/assessment" element={<Assessment />} />
>>>>>>> 2a62fa6b7a13aa05662930812d05cb32d53c64e0
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
<<<<<<< HEAD
            path="/chat/:partnerId"
            element={
              <ProtectedRoute>
                <ChatPage />
              </ProtectedRoute>
            }
          />

          <Route
=======
>>>>>>> 2a62fa6b7a13aa05662930812d05cb32d53c64e0
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
<<<<<<< HEAD
=======
          <Route path="/survey-examples" element={<SurveyProfiles />} />
>>>>>>> 2a62fa6b7a13aa05662930812d05cb32d53c64e0
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

<<<<<<< HEAD
      <Footer />

      {/* Global Floating AI Chatbot Widget */}
      <ChatBotWidget />

      {/* Global Incoming Call Alert */}
      <IncomingCallAlert onAcceptCall={handleAcceptIncomingCall} />

      {/* Active Received Video Call */}
      {activeCallPartner && (
=======
      {!isAuthPage && <Footer />}

      {/* Global Floating AI Chatbot Widget */}
      {!isAuthPage && <ChatBotWidget />}

      {/* Global Incoming Call Alert */}
      {!isAuthPage && <IncomingCallAlert onAcceptCall={handleAcceptIncomingCall} />}

      {/* Active Received Video Call */}
      {!isAuthPage && activeCallPartner && (
>>>>>>> 2a62fa6b7a13aa05662930812d05cb32d53c64e0
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
