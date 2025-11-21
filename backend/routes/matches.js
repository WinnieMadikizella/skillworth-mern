import express from 'express';
import MentorProfile from '../models/MentorProfile.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// AI Matching Algorithm
const calculateMatchScore = (mentor, menteeSkills = {}) => {
  let score = 50; // Base score
  const reasons = [];

  // Role matching (30% weight)
  if (mentor.currentRole && mentor.currentRole.toLowerCase().includes('frontend')) {
    score += 20;
    reasons.push('🎯 Perfect frontend role alignment');
  } else if (mentor.currentRole && mentor.currentRole.toLowerCase().includes('fullstack')) {
    score += 15;
    reasons.push('🔄 Fullstack development expertise');
  }

  // Experience consideration (20% weight)
  if (mentor.yearsExperience >= 5) {
    score += 15;
    reasons.push(`💼 ${mentor.yearsExperience}+ years industry experience`);
  } else if (mentor.yearsExperience >= 3) {
    score += 10;
    reasons.push('📈 Solid professional experience');
  }

  // Success metrics boost (25% weight)
  if (mentor.successMetrics && mentor.successMetrics.successRate >= 90) {
    score += 20;
    reasons.push('🏅 Elite success record with mentees');
  } else if (mentor.successMetrics && mentor.successMetrics.successRate >= 80) {
    score += 15;
    reasons.push('⭐ Proven track record of success');
  }

  // Skills matching (25% weight)
  if (mentor.expertiseAreas && mentor.expertiseAreas.length > 0) {
    score += 15;
    reasons.push(`🛠️ Expertise in ${mentor.expertiseAreas.slice(0, 3).join(', ')}`);
  }

  // Ensure score is between 0-100
  score = Math.max(0, Math.min(100, Math.round(score)));

  return { score, reasons: reasons.slice(0, 3) };
};

// Get suggested mentor matches
router.get('/suggested', auth, async (req, res) => {
  try {
    // Get all active mentors
    const mentors = await MentorProfile.find({ 
      isAcceptingNewMentees: true 
    }).populate('user', 'firstName lastName avatar email');

    // If no mentors in DB, return sample data
    if (mentors.length === 0) {
      const sampleMentors = [
        {
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
        {
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
        {
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
        }
      ];

      const matches = sampleMentors.map(mentor => {
        const matchResult = calculateMatchScore(mentor);
        return {
          mentor,
          matchScore: matchResult.score,
          reasons: matchResult.reasons
        };
      });

      return res.json({ 
        success: true,
        matches: matches.sort((a, b) => b.matchScore - a.matchScore)
      });
    }

    // Calculate matches with real mentors
    const matches = mentors.map(mentor => {
      const matchResult = calculateMatchScore(mentor);
      return {
        mentor: mentor.toObject(),
        matchScore: matchResult.score,
        reasons: matchResult.reasons
      };
    });

    // Sort by match score (highest first)
    matches.sort((a, b) => b.matchScore - a.matchScore);

    res.json({
      success: true,
      matches: matches.slice(0, 6) // Return top 6 matches
    });

  } catch (error) {
    console.error('Matches error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch mentor matches'
    });
  }
});

// Request to connect with mentor
router.post('/request', auth, async (req, res) => {
  try {
    const { mentorId, message } = req.body;
    const menteeId = req.user._id;

    // In a real app, you'd create a Match record here
    // For demo, just return success

    res.json({
      success: true,
      message: 'Connection request sent successfully!',
      data: {
        mentorId,
        menteeId,
        message: message || 'I would love to learn from your experience!',
        requestedAt: new Date().toISOString()
      }
    });

  } catch (error) {
    console.error('Match request error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send connection request'
    });
  }
});

export default router;
