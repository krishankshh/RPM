import { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { signInWithPopup } from 'firebase/auth'
import { auth, googleProvider } from './firebase'
import { authAPI } from './api'
import Cookies from 'js-cookie'

// Components
import LoginPage from './components/LoginPage'
import RegisterPage from './components/RegisterPage'
import WaitlistPage from './components/WaitlistPage'
import OnboardingPage from './components/OnboardingPage'
import Dashboard from './components/Dashboard'
import TutorPage from './components/TutorPage'
import QuizPage from './components/QuizPage'
import AdminDashboard from './components/AdminDashboard'
import CookieConsent from './components/CookieConsent'
import LoadingSpinner from './components/LoadingSpinner'

import './App.css'

function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [credits, setCredits] = useState(null)
  const [authError, setAuthError] = useState('')

  useEffect(() => {
    checkAuthStatus()
  }, [])

  const checkAuthStatus = async () => {
    const token = Cookies.get('auth_token')
    if (token) {
      try {
        const response = await authAPI.getUserStatus()
        setUser(response.data.user)
        setCredits(response.data.credits)
      } catch (error) {
        console.error('Auth check failed:', error)
        Cookies.remove('auth_token')
      }
    }
    setLoading(false)
  }

  const handleGoogleLogin = async () => {
    try {
      setLoading(true)
      setAuthError('')
      const result = await signInWithPopup(auth, googleProvider)
      const user = result.user
      
      const userData = {
        google_id: user.uid,
        email: user.email,
        name: user.displayName,
        picture: user.photoURL
      }

      const response = await authAPI.googleLogin(userData)
      
      Cookies.set('auth_token', response.data.token, { expires: 7 })
      setUser(response.data.user)
      
      // Get credits
      const creditsResponse = await authAPI.getUserStatus()
      setCredits(creditsResponse.data.credits)
      
    } catch (error) {
      console.error('Login failed:', error)
      setAuthError(error.response?.data?.error || 'Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleManualLogin = async (credentials) => {
    try {
      setLoading(true)
      setAuthError('')
      
      const response = await authAPI.login(credentials)
      
      Cookies.set('auth_token', response.data.token, { expires: 7 })
      setUser(response.data.user)
      
      // Get credits
      const creditsResponse = await authAPI.getUserStatus()
      setCredits(creditsResponse.data.credits)
      
    } catch (error) {
      console.error('Login failed:', error)
      setAuthError(error.response?.data?.error || 'Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleRegister = async (userData) => {
    try {
      setLoading(true)
      setAuthError('')
      
      const response = await authAPI.register(userData)
      
      Cookies.set('auth_token', response.data.token, { expires: 7 })
      setUser(response.data.user)
      
      // Get credits
      const creditsResponse = await authAPI.getUserStatus()
      setCredits(creditsResponse.data.credits)
      
    } catch (error) {
      console.error('Registration failed:', error)
      setAuthError(error.response?.data?.error || 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    Cookies.remove('auth_token')
    setUser(null)
    setCredits(null)
    setAuthError('')
    auth.signOut()
  }

  const updateCredits = (newCredits) => {
    setCredits(newCredits)
  }

  if (loading) {
    return <LoadingSpinner />
  }

  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
        {authError && (
          <div className="fixed top-4 right-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded z-50">
            {authError}
            <button 
              onClick={() => setAuthError('')}
              className="ml-2 text-red-500 hover:text-red-700"
            >
              ×
            </button>
          </div>
        )}
        
        <Routes>
          <Route 
            path="/login" 
            element={
              user ? <Navigate to="/" /> : 
              <LoginPage 
                onGoogleLogin={handleGoogleLogin} 
                onManualLogin={handleManualLogin}
                onSwitchToRegister={() => window.location.href = '/register'}
                loading={loading} 
              />
            } 
          />
          
          <Route 
            path="/register" 
            element={
              user ? <Navigate to="/" /> : 
              <RegisterPage 
                onRegister={handleRegister}
                onSwitchToLogin={() => window.location.href = '/login'}
                loading={loading} 
              />
            } 
          />
          
          <Route 
            path="/waitlist" 
            element={
              !user ? <Navigate to="/login" /> :
              <WaitlistPage user={user} />
            } 
          />
          
          <Route 
            path="/onboarding" 
            element={
              !user ? <Navigate to="/login" /> :
              user.profile_completed ? <Navigate to="/" /> :
              <OnboardingPage user={user} setUser={setUser} />
            } 
          />
          
          <Route 
            path="/" 
            element={
              !user ? <Navigate to="/login" /> :
              !user.is_whitelisted ? <Navigate to="/waitlist" /> :
              !user.profile_completed ? <Navigate to="/onboarding" /> :
              <Dashboard 
                user={user} 
                credits={credits} 
                onLogout={handleLogout}
                updateCredits={updateCredits}
              />
            } 
          />
          
          <Route 
            path="/tutor" 
            element={
              !user ? <Navigate to="/login" /> :
              !user.is_whitelisted ? <Navigate to="/waitlist" /> :
              <TutorPage 
                user={user} 
                credits={credits} 
                onLogout={handleLogout}
                updateCredits={updateCredits}
              />
            } 
          />
          
          <Route 
            path="/quiz" 
            element={
              !user ? <Navigate to="/login" /> :
              !user.is_whitelisted ? <Navigate to="/waitlist" /> :
              <QuizPage 
                user={user} 
                credits={credits} 
                onLogout={handleLogout}
                updateCredits={updateCredits}
              />
            } 
          />
          
          <Route 
            path="/admin" 
            element={
              !user ? <Navigate to="/login" /> :
              !user.is_admin ? <Navigate to="/" /> :
              <AdminDashboard />
            } 
          />
        </Routes>
        
        <CookieConsent />
      </div>
    </Router>
  )
}

export default App

