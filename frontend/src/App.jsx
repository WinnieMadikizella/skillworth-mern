import React, { useState } from 'react'
import './styles/globals.css'

function App() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (data.success) {
        setUser(data.user)
        localStorage.setItem('token', data.token)
        localStorage.setItem('user', JSON.stringify(data.user))
      } else {
        alert('Login failed: ' + data.message)
      }
    } catch (error) {
      console.error('Login error:', error)
      alert('Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    setUser(null)
    localStorage.removeItem('token')
    localStorage.removeItem('user')
  }

  if (user) {
    return (
      <div className="app">
        <div className="dashboard">
          <header className="header">
            <div className="user-info">
              <div className="avatar">{user.name.split(' ').map(n => n[0]).join('')}</div>
              <div>
                <h2>Welcome, {user.name}!</h2>
                <p>{user.userType === 'mentee' ? 'Career Seeker' : 'Mentor'}</p>
              </div>
            </div>
            <button onClick={handleLogout} className="logout-btn">Logout</button>
          </header>
          
          <div className="content">
            <h1>🎯 SkillWorth Dashboard</h1>
            <p>Your career transformation journey starts here</p>
            
            <div className="stats-grid">
              <div className="stat-card">
                <h3>Predictive Score</h3>
                <div className="value">87%</div>
                <p>Job placement chance</p>
              </div>
              <div className="stat-card">
                <h3>Mentor Matches</h3>
                <div className="value">8</div>
                <p>Based on your profile</p>
              </div>
            </div>

            <button className="cta-button">
              Find Your Perfect Mentor →
            </button>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="app">
      <div className="login-container">
        <div className="login-card">
          <h1>🎯 SkillWorth</h1>
          <p className="tagline">Your Net Worth is Your Skillset</p>
          
          <form onSubmit={handleLogin} className="login-form">
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
              />
            </div>
            
            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                required
              />
            </div>
            
            <button type="submit" disabled={loading} className="login-btn">
              {loading ? 'Logging in...' : 'Launch Your Journey'}
            </button>
            
            <p className="demo-note">✨ Demo: Use any email to auto-create account</p>
          </form>
        </div>
      </div>
    </div>
  )
}

export default App
