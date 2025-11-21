import MentorProfile from '../models/MentorProfile.js';
import MenteeProfile from '../models/MenteeProfile.js';

/**
 * Advanced AI Matching Algorithm
 * Calculates compatibility score between mentor and mentee
 */
export const calculateAdvancedMatch = async (mentorId, menteeId) => {
  try {
    const mentor = await MentorProfile.findById(mentorId).populate('user');
    const mentee = await MenteeProfile.findById(menteeId).populate('user');

    if (!mentor || !mentee) {
      throw new Error('Mentor or mentee not found');
    }

    let totalScore = 0;
    const maxPossibleScore = 100;
    const reasons = [];
    const detailedScores = {};

    // 1. Role Alignment (25 points max)
    const roleScore = calculateRoleAlignment(mentor.currentRole, mentee.targetRole);
    totalScore += roleScore.score;
    detailedScores.roleAlignment = roleScore.score;
    if (roleScore.reason) reasons.push(roleScore.reason);

    // 2. Skill Gap Analysis (25 points max)
    const skillScore = calculateSkillCompatibility(mentor.expertiseAreas, mentee.skills);
    totalScore += skillScore.score;
    detailedScores.skillCompatibility = skillScore.score;
    if (skillScore.reason) reasons.push(skillScore.reason);

    // 3. Experience Level Match (20 points max)
    const experienceScore = calculateExperienceMatch(mentor.yearsExperience, mentee.experienceLevel, mentee.careerStage);
    totalScore += experienceScore.score;
    detailedScores.experienceMatch = experienceScore.score;
    if (experienceScore.reason) reasons.push(experienceScore.reason);

    // 4. Success Probability (15 points max)
    const successScore = calculateSuccessProbability(mentor.successMetrics, mentee.careerStage);
    totalScore += successScore.score;
    detailedScores.successProbability = successScore.score;
    if (successScore.reason) reasons.push(successScore.reason);

    // 5. Learning Style & Availability (15 points max)
    const compatibilityScore = calculateCompatibilityFactors(mentor, mentee);
    totalScore += compatibilityScore.score;
    detailedScores.compatibility = compatibilityScore.score;
    if (compatibilityScore.reason) reasons.push(compatibilityScore.reason);

    // Ensure score is within bounds
    const finalScore = Math.max(0, Math.min(100, Math.round(totalScore)));

    return {
      score: finalScore,
      reasons: reasons.slice(0, 4), // Top 4 reasons
      detailedScores,
      mentor: {
        id: mentor._id,
        name: `${mentor.user.firstName} ${mentor.user.lastName}`,
        role: mentor.currentRole,
        expertise: mentor.expertiseAreas
      },
      mentee: {
        id: mentee._id,
        name: `${mentee.user.firstName} ${mentee.user.lastName}`,
        targetRole: mentee.targetRole,
        experienceLevel: mentee.experienceLevel
      },
      analysis: {
        strength: getStrengthLevel(finalScore),
        recommendation: getRecommendation(finalScore),
        estimatedTimeline: estimateTimeline(mentee.experienceLevel, finalScore)
      }
    };

  } catch (error) {
    console.error('Advanced match calculation error:', error);
    throw error;
  }
};

/**
 * Role Alignment Scoring
 */
const calculateRoleAlignment = (mentorRole, menteeTargetRole) => {
  if (!mentorRole || !menteeTargetRole) {
    return { score: 10, reason: '⚡ General tech mentorship available' };
  }

  const mentorRoleLower = mentorRole.toLowerCase();
  const targetRoleLower = menteeTargetRole.toLowerCase();

  // Exact match
  if (mentorRoleLower === targetRoleLower || 
      mentorRoleLower.includes(targetRoleLower) || 
      targetRoleLower.includes(mentorRoleLower)) {
    return { score: 25, reason: '🎯 Perfect role alignment' };
  }

  // Category-based matching
  const roleCategories = {
    frontend: ['frontend', 'react', 'angular', 'vue', 'javascript', 'ui', 'ux'],
    backend: ['backend', 'node', 'python', 'java', 'c#', 'php', 'api', 'server'],
    fullstack: ['fullstack', 'full stack', 'mern', 'mean'],
    mobile: ['mobile', 'ios', 'android', 'react native', 'flutter'],
    devops: ['devops', 'cloud', 'aws', 'azure', 'docker', 'kubernetes'],
    data: ['data', 'machine learning', 'ai', 'analytics', 'scientist']
  };

  for (const [category, keywords] of Object.entries(roleCategories)) {
    const mentorInCategory = keywords.some(kw => mentorRoleLower.includes(kw));
    const menteeInCategory = keywords.some(kw => targetRoleLower.includes(kw));
    
    if (mentorInCategory && menteeInCategory) {
      return { score: 20, reason: `🔄 Strong ${category} role alignment` };
    }
  }

  // Partial match
  const mentorWords = new Set(mentorRoleLower.split(/\s+/));
  const targetWords = new Set(targetRoleLower.split(/\s+/));
  const commonWords = [...mentorWords].filter(word => targetWords.has(word));
  
  if (commonWords.length > 0) {
    return { score: 15, reason: '📊 Partial role overlap' };
  }

  return { score: 10, reason: '🌱 General development mentorship' };
};

/**
 * Skill Compatibility Scoring
 */
const calculateSkillCompatibility = (mentorExpertise, menteeSkills) => {
  if (!mentorExpertise || mentorExpertise.length === 0) {
    return { score: 10, reason: '📚 Foundational guidance available' };
  }

  if (!menteeSkills || Object.keys(menteeSkills).size === 0) {
    return { score: 15, reason: '🆕 Perfect for complete beginners' };
  }

  const menteeSkillNames = Object.keys(menteeSkills);
  const matchingSkills = mentorExpertise.filter(skill => 
    menteeSkillNames.some(ms => 
      ms.toLowerCase().includes(skill.toLowerCase()) ||
      skill.toLowerCase().includes(ms.toLowerCase())
    )
  );

  const matchPercentage = (matchingSkills.length / mentorExpertise.length) * 100;

  if (matchPercentage > 75) {
    return { 
      score: 25, 
      reason: `💪 Excellent skill overlap (${matchingSkills.length} matching skills)` 
    };
  } else if (matchPercentage > 50) {
    return { 
      score: 20, 
      reason: `🛠️ Good skill compatibility (${matchingSkills.length} relevant skills)` 
    };
  } else if (matchPercentage > 25) {
    return { 
      score: 15, 
      reason: `🔧 Some skill alignment (${matchingSkills.length} transferable skills)` 
    };
  } else {
    return { 
      score: 10, 
      reason: '🌱 Complementary skill development opportunity' 
    };
  }
};

/**
 * Experience Level Matching
 */
const calculateExperienceMatch = (mentorExperience, menteeLevel, careerStage) => {
  let score = 0;
  let reason = '';

  switch (menteeLevel) {
    case 'beginner':
      if (mentorExperience >= 5) {
        score = 20;
        reason = '👨‍🏫 Highly experienced with beginners';
      } else if (mentorExperience >= 3) {
        score = 17;
        reason = '🎓 Experienced with entry-level developers';
      } else {
        score = 12;
        reason = '🌟 Peer-level guidance';
      }
      break;

    case 'intermediate':
      if (mentorExperience >= 7) {
        score = 20;
        reason = '🚀 Senior expert for career advancement';
      } else if (mentorExperience >= 5) {
        score = 18;
        reason = '📈 Strong mid-level to senior guidance';
      } else {
        score = 14;
        reason = '💼 Practical peer mentorship';
      }
      break;

    case 'advanced':
      if (mentorExperience >= 8) {
        score = 20;
        reason = '🏆 Elite senior-to-senior mentorship';
      } else if (mentorExperience >= 6) {
        score = 16;
        reason = '🔬 Advanced technical guidance';
      } else {
        score = 12;
        reason = '🤝 Collaborative advanced development';
      }
      break;

    default:
      score = 10;
      reason = '📖 General development guidance';
  }

  // Bonus for career stage alignment
  if (careerStage === 'job-hunting' && mentorExperience >= 5) {
    score += 2;
    reason += ' + hiring experience';
  }

  return { score: Math.min(20, score), reason };
};

/**
 * Success Probability Based on Mentor Track Record
 */
const calculateSuccessProbability = (successMetrics, careerStage) => {
  if (!successMetrics) {
    return { score: 8, reason: '📊 Building mentorship experience' };
  }

  const { successRate = 0, studentsPlaced = 0, avgTimeToJob = 12 } = successMetrics;

  let score = 0;
  let reason = '';

  if (successRate >= 90 && studentsPlaced >= 30) {
    score = 15;
    reason = '🏅 Elite success record';
  } else if (successRate >= 85 && studentsPlaced >= 20) {
    score = 13;
    reason = '⭐ Exceptional track record';
  } else if (successRate >= 80 && studentsPlaced >= 10) {
    score = 11;
    reason = '📈 Proven success history';
  } else if (successRate >= 70) {
    score = 9;
    reason = '👍 Solid mentorship results';
  } else {
    score = 7;
    reason = '🌱 Growing mentorship practice';
  }

  // Bonus for fast placements
  if (avgTimeToJob <= 6) {
    score += 2;
    reason += ' + fast placements';
  }

  // Career stage specific bonus
  if (careerStage === 'job-hunting' && studentsPlaced >= 5) {
    score += 1;
    reason += ' + job placement focus';
  }

  return { score: Math.min(15, score), reason };
};

/**
 * Compatibility Factors (Learning Style, Availability, etc.)
 */
const calculateCompatibilityFactors = (mentor, mentee) => {
  let score = 0;
  const reasons = [];

  // Availability match (5 points)
  if (mentee.availability && mentee.availability.hoursPerWeek >= 10) {
    score += 3;
    reasons.push('🕒 Good time commitment');
  }

  // Budget alignment (5 points)
  if (mentee.budget && mentee.budget >= mentor.hourlyRate * 0.7) {
    score += 4;
    reasons.push('💰 Budget alignment');
  }

  // Learning style consideration (5 points)
  if (mentee.preferredLearningStyle) {
    score += 3;
    reasons.push('📖 Learning style considered');
  }

  return { 
    score: Math.min(15, score), 
    reason: reasons.join(' • ') || '🌐 General compatibility' 
  };
};

/**
 * Helper Functions
 */
const getStrengthLevel = (score) => {
  if (score >= 90) return 'Exceptional';
  if (score >= 80) return 'Strong';
  if (score >= 70) return 'Good';
  if (score >= 60) return 'Moderate';
  return 'Basic';
};

const getRecommendation = (score) => {
  if (score >= 85) return 'Highly Recommended - Perfect Match';
  if (score >= 75) return 'Strongly Recommended - Great Fit';
  if (score >= 65) return 'Recommended - Good Potential';
  if (score >= 55) return 'Consider - Some Alignment';
  return 'Explore - Basic Compatibility';
};

const estimateTimeline = (experienceLevel, matchScore) => {
  const baseTimeline = {
    beginner: 6,
    intermediate: 4,
    advanced: 3
  }[experienceLevel] || 5;

  // Adjust based on match quality
  const adjustment = (100 - matchScore) / 100;
  return Math.round(baseTimeline + (baseTimeline * adjustment));
};

export default {
  calculateAdvancedMatch,
  calculateRoleAlignment,
  calculateSkillCompatibility,
  calculateExperienceMatch,
  calculateSuccessProbability,
  calculateCompatibilityFactors
};
