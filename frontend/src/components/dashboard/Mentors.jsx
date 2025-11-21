import React, { useState, useEffect } from 'react';
import './Mentors.css';

const Mentors = () => {
  const [mentors, setMentors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMentor, setSelectedMentor] = useState(null);
  const [connectionMessage, setConnectionMessage] = useState('');

  useEffect(() => {
    fetchMentors();
  }, []);

  const fetchMentors = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/matches/suggested', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      const data = await response.json();

      if (data.success) {
        setMentors(data.matches);
      } else {
        // Fallback to demo data
        setMentors(getDemoMentors());
      }
    } catch (error) {
      console.error('Failed to fetch mentors:', error);
      // Fallback to demo data
      setMentors(getDemoMentors());
    } finally {
      setLoading(false);
    }
  };

  const getDemoMentors = () => {
    return [
      {
        mentor: {
          _id: '1',
          user: {
            firstName: 'Sarah',
            lastName: 'Ahmed',
            avatar: 'SA',
            email: 'sarah@tech.com'
          },
          currentRole: 'Senior Frontend Engineer',
          currentCompany: 'TechCompany',
          yearsExperience: 5,
          hourlyRate: 75,
          expertiseAreas: ['React', 'TypeScript', 'Next.js', 'UI/UX'],
          successMetrics: {
            studentsPlaced: 42,
            avgTimeToJob: 3.2,
            successRate: 95
          },
          bio: 'Passionate about mentoring and helping others break into tech. Specialized in frontend development with 5+ years at top tech companies.',
          rating: { average: 4.9, count: 28 }
        },
        matchScore: 94,
        reasons: [
          '🎯 Perfect frontend role alignment',
          '💼 5+ years industry experience', 
          '🏅 Elite success record with mentees'
        ]
      },
      {
        mentor: {
          _id: '2',
          user: {
            firstName: 'David',
            lastName: 'Mwangi',
            avatar: 'DM', 
            email: 'david@startup.com'
          },
          currentRole: 'Tech Lead',
          currentCompany: 'Startup Inc',
          yearsExperience: 7,
          hourlyRate: 85,
          expertiseAreas: ['JavaScript', 'Node.js', 'AWS', 'System Design'],
          successMetrics: {
            studentsPlaced: 28,
            avgTimeToJob: 3.8,
            successRate: 88
          },
          bio: 'Fullstack developer with startup experience. Helped build 3 successful tech startups from ground up.',
          rating: { average: 4.7, count: 19 }
        },
        matchScore: 86,
        reasons: [
          '🔄 Fullstack development expertise',
          '🚀 Strong startup connections',
          '⭐ Proven track record of success'
        ]
      },
      {
        mentor: {
          _id: '3',
          user: {
            firstName: 'Grace',
            lastName: 'Omondi',
            avatar: 'GO',
            email: 'grace@innovation.com'
          },
          currentRole: 'Fullstack Developer',
          currentCompany: 'Innovation Labs', 
          yearsExperience: 4,
          hourlyRate: 65,
          expertiseAreas: ['React', 'Python', 'Django', 'PostgreSQL'],
          successMetrics: {
            studentsPlaced: 35,
            avgTimeToJob: 4.1,
            successRate: 92
          },
          bio: 'Specialized in Python and React development. Love helping students build real-world projects and portfolios.',
          rating: { average: 4.8, count: 22 }
        },
        matchScore: 89,
        reasons: [
          '🛠️ Expertise in React & Python',
          '📈 Solid professional experience',
          '🌱 Great for project-based learning'
        ]
      }
    ];
  };

  const requestConnection = async (mentorId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('/api/matches/request', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          mentorId,
          message: connectionMessage || 'I would love to connect and learn from your experience!'
        })
      });

      const data = await response.json();

      if (data.success) {
        alert('✅ Connection request sent successfully!');
        setSelectedMentor(null);
        setConnectionMessage('');
      } else {
        alert('Connection request failed. Please try again.');
      }
    } catch (error) {
      console.error('Connection request error:', error);
      alert('✅ Demo: Connection request would be sent to mentor!');
      setSelectedMentor(null);
      setConnectionMessage('');
    }
  };

  const getScoreColor = (score) => {
    if (score >= 90) return '#4CAF50';
    if (score >= 80) return '#2196F3';
    return '#FF9800';
  };

  const getScoreText = (score) => {
    if (score >= 90) return 'Perfect Match!';
    if (score >= 80) return 'Excellent Fit';
    return 'Good Match';
  };

  if (loading) {
    return (
      <div className="mentors-loading">
        <div className="spinner"></div>
        <p>Finding your perfect mentor matches...</p>
      </div>
    );
  }

  return (
    <div className="mentors-container">
      <div className="mentors-header">
        <h1>👥 Your Mentor Matches</h1>
        <p>AI-powered matches based on your goals, skills, and learning style</p>
      </div>

      <div className="mentors-grid">
        {mentors.map((match, index) => (
          <div key={match.mentor._id || index} className="mentor-card">
            <div className="mentor-header">
              <div className="mentor-avatar">
                {match.mentor.user.avatar}
              </div>
              <div className="mentor-info">
                <h3>{match.mentor.user.firstName} {match.mentor.user.lastName}</h3>
                <div className="mentor-badge">
                  {match.mentor.successMetrics.successRate}% Success Rate
                </div>
              </div>
            </div>

            <div className="mentor-role">
              <strong>{match.mentor.currentRole}</strong> at {match.mentor.currentCompany}
            </div>

            <p className="mentor-bio">{match.mentor.bio}</p>

            <div className="mentor-skills">
              {match.mentor.expertiseAreas.slice(0, 4).map((skill, idx) => (
                <span key={idx} className="skill-tag">{skill}</span>
              ))}
            </div>

            <div className="mentor-metrics">
              <div className="metric">
                <div className="metric-value">{match.mentor.successMetrics.studentsPlaced}</div>
                <div className="metric-label">Students Placed</div>
              </div>
              <div className="metric">
                <div className="metric-value">{match.mentor.successMetrics.avgTimeToJob} months</div>
                <div className="metric-label">Avg. Time to Job</div>
              </div>
              <div className="metric">
                <div className="metric-value">${match.mentor.hourlyRate}/hr</div>
                <div className="metric-label">Hourly Rate</div>
              </div>
            </div>

            <div 
              className="match-score" 
              style={{ background: getScoreColor(match.matchScore) }}
            >
              <div className="score-label">AI Match Score</div>
              <div className="score-value">{match.matchScore}%</div>
              <div className="score-text">{getScoreText(match.matchScore)}</div>
            </div>

            <div className="match-reasons">
              {match.reasons.map((reason, idx) => (
                <div key={idx} className="reason">{reason}</div>
              ))}
            </div>

            <button 
              className="connect-btn"
              onClick={() => setSelectedMentor(match.mentor)}
            >
              Connect with {match.mentor.user.firstName}
            </button>
          </div>
        ))}
      </div>

      {/* Connection Modal */}
      {selectedMentor && (
        <div className="modal-overlay">
          <div className="connection-modal">
            <h3>Connect with {selectedMentor.user.firstName}</h3>
            <p>Send a message to start your mentorship journey</p>
            
            <div className="form-group">
              <label>Your Message (optional)</label>
              <textarea
                value={connectionMessage}
                onChange={(e) => setConnectionMessage(e.target.value)}
                placeholder="I'm interested in learning about your experience with..."
                rows="4"
              />
            </div>

            <div className="modal-actions">
              <button 
                className="btn-secondary"
                onClick={() => setSelectedMentor(null)}
              >
                Cancel
              </button>
              <button 
                className="btn-primary"
                onClick={() => requestConnection(selectedMentor._id)}
              >
                Send Connection Request
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Mentors;
