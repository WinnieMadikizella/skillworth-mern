import mongoose from 'mongoose';

const menteeProfileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  targetRole: {
    type: String,
    required: [true, 'Target role is required'],
    trim: true
  },
  experienceLevel: {
    type: String,
    required: true,
    enum: {
      values: ['beginner', 'intermediate', 'advanced'],
      message: 'Experience level must be beginner, intermediate, or advanced'
    },
    default: 'beginner'
  },
  currentStatus: {
    type: String,
    enum: ['student', 'employed', 'unemployed', 'career-switcher'],
    default: 'student'
  },
  targetSalary: {
    type: Number,
    min: 0
  },
  currentSalary: {
    type: Number,
    min: 0
  },
  skills: {
    type: Map,
    of: Number, // skill -> proficiency level (0-100)
    default: {}
  },
  learningGoals: [{
    goal: String,
    deadline: Date,
    isCompleted: { type: Boolean, default: false }
  }],
  bio: {
    type: String,
    maxlength: [1000, 'Bio cannot be more than 1000 characters']
  },
  education: {
    highestDegree: String,
    fieldOfStudy: String,
    institution: String,
    graduationYear: Number
  },
  preferredLearningStyle: {
    type: String,
    enum: ['visual', 'auditory', 'kinesthetic', 'reading-writing'],
    default: 'visual'
  },
  availability: {
    hoursPerWeek: { type: Number, min: 1, max: 40, default: 10 },
    preferredTime: { type: String, enum: ['morning', 'afternoon', 'evening', 'weekend'], default: 'evening' }
  },
  budget: {
    type: Number,
    min: 0
  },
  careerStage: {
    type: String,
    enum: ['exploring', 'learning', 'job-hunting', 'career-growth'],
    default: 'learning'
  },
  previousExperience: [{
    role: String,
    company: String,
    duration: String,
    description: String
  }],
  projects: [{
    name: String,
    description: String,
    technologies: [String],
    link: String
  }],
  jobPreferences: {
    locations: [String],
    companySize: [String],
    industries: [String],
    remotePreference: { type: String, enum: ['remote', 'hybrid', 'onsite'], default: 'remote' }
  },
  progress: {
    skillsMastered: { type: Number, default: 0 },
    projectsCompleted: { type: Number, default: 0 },
    interviewsCompleted: { type: Number, default: 0 },
    mentorshipSessions: { type: Number, default: 0 }
  },
  achievements: [{
    title: String,
    description: String,
    date: Date,
    category: String
  }]
}, {
  timestamps: true
});

// Indexes for better query performance
menteeProfileSchema.index({ user: 1 });
menteeProfileSchema.index({ targetRole: 1 });
menteeProfileSchema.index({ experienceLevel: 1 });
menteeProfileSchema.index({ careerStage: 1 });

// Virtual for salary increase
menteeProfileSchema.virtual('salaryIncrease').get(function() {
  if (this.currentSalary && this.targetSalary) {
    return this.targetSalary - this.currentSalary;
  }
  return 0;
});

// Virtual for progress percentage
menteeProfileSchema.virtual('progressPercentage').get(function() {
  const totalGoals = this.learningGoals.length;
  if (totalGoals === 0) return 0;
  
  const completedGoals = this.learningGoals.filter(goal => goal.isCompleted).length;
  return Math.round((completedGoals / totalGoals) * 100);
});

// Method to add or update skill
menteeProfileSchema.methods.addSkill = function(skill, proficiency) {
  this.skills.set(skill, Math.min(100, Math.max(0, proficiency)));
  return this.save();
};

// Method to calculate skill gap
menteeProfileSchema.methods.getSkillGap = function(requiredSkills) {
  const gap = {};
  for (const [skill, requiredLevel] of Object.entries(requiredSkills)) {
    const currentLevel = this.skills.get(skill) || 0;
    gap[skill] = Math.max(0, requiredLevel - currentLevel);
  }
  return gap;
};

// Method to complete learning goal
menteeProfileSchema.methods.completeGoal = function(goalIndex) {
  if (this.learningGoals[goalIndex]) {
    this.learningGoals[goalIndex].isCompleted = true;
    this.progress.skillsMastered += 1;
    return this.save();
  }
  throw new Error('Goal not found');
};

// Static method to find mentees by target role
menteeProfileSchema.statics.findByTargetRole = function(role) {
  return this.find({ targetRole: new RegExp(role, 'i') })
    .populate('user', 'firstName lastName avatar email');
};

// Static method to get mentee analytics
menteeProfileSchema.statics.getAnalytics = function(menteeId) {
  return this.findById(menteeId)
    .populate('user')
    .then(mentee => {
      if (!mentee) return null;

      const skills = Object.fromEntries(mentee.skills);
      const totalSkills = Object.keys(skills).length;
      const averageSkillLevel = totalSkills > 0 
        ? Math.round(Object.values(skills).reduce((a, b) => a + b, 0) / totalSkills)
        : 0;

      return {
        basicInfo: {
          name: `${mentee.user.firstName} ${mentee.user.lastName}`,
          targetRole: mentee.targetRole,
          experienceLevel: mentee.experienceLevel,
          careerStage: mentee.careerStage
        },
        progress: {
          percentage: mentee.progressPercentage,
          skillsMastered: mentee.progress.skillsMastered,
          projectsCompleted: mentee.progress.projectsCompleted,
          mentorshipSessions: mentee.progress.mentorshipSessions
        },
        skills: {
          total: totalSkills,
          averageLevel: averageSkillLevel,
          breakdown: skills
        },
        goals: {
          total: mentee.learningGoals.length,
          completed: mentee.learningGoals.filter(g => g.isCompleted).length,
          pending: mentee.learningGoals.filter(g => !g.isCompleted).length
        },
        financial: {
          currentSalary: mentee.currentSalary,
          targetSalary: mentee.targetSalary,
          salaryIncrease: mentee.salaryIncrease
        }
      };
    });
};

// Pre-save middleware to update progress
menteeProfileSchema.pre('save', function(next) {
  // Update skills mastered count based on completed goals
  if (this.isModified('learningGoals')) {
    this.progress.skillsMastered = this.learningGoals.filter(goal => goal.isCompleted).length;
  }
  next();
});

export default mongoose.model('MenteeProfile', menteeProfileSchema);
