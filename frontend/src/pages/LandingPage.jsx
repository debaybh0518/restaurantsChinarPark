import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import OnboardingPage from './OnboardingPage';
import LoginPage from './LoginPage';

export default function LandingPage() {
  const [showOnboarding, setShowOnboarding] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-sky-100 to-blue-200">
      <div className="bg-white rounded-lg shadow-lg p-10 flex flex-col items-center max-w-md w-full">
        <h1 className="text-3xl font-extrabold text-sky-800 mb-4">Welcome to Rannaghor360</h1>
        <p className="mb-6 text-gray-600 text-center">Your complete restaurant management solution. Please login or register to continue.</p>
        <div className="flex gap-4 w-full justify-center">
          <Link to="/login" className="bg-sky-600 hover:bg-sky-700 text-white font-bold py-2 px-6 rounded transition" onClick={() => setShowLogin(true)}>Login</Link>
          <Link to="/register" className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded transition" onClick={() => setShowOnboarding(true)}>Register</Link>
        </div>
      </div>
      {/* Onboarding Modal */}
      {showOnboarding && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md relative">
            <button className="absolute top-2 right-2 text-xl text-slate-400 hover:text-pink-500" onClick={() => setShowOnboarding(false)} aria-label="Close">&times;</button>
            <OnboardingPage onClose={() => setShowOnboarding(false)} />
          </div>
        </div>
      )}
      {/* Login Modal */}
      {showLogin && (
        <div className="fixed inset-0 bg-black/30 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-md relative">
            <button className="absolute top-2 right-2 text-xl text-slate-400 hover:text-sky-600" onClick={() => setShowLogin(false)}>&times;</button>
            <LoginPage />
          </div>
        </div>
      )}
    </div>
  );
}