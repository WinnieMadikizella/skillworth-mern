import mongoose from 'mongoose';

const successMetricsSchema = new mongoose.Schema({
  studentsPlaced: {
    type: Number,
    default: 0,
    min: 0
  },
  avgTimeToJob: {
    type: Number,
    default: 0,
    min: 0
  },
  successRate: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  }
});

const mentorProfileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  currentRole: {
    type: String,
    required: [true, 'Current role is required'],
    trim: true
  },
  currentCompany: {
    type: String,
    trim: true
  },
  yearsExperience: {
    type: Number,
    required: [true, 'Years of experience is required'],
    min: 0,
    max: 50
  },
  hourlyRate: {
    type: Number,
    required: [true, 'Hourly rate is required'],
    min: 0
  },
  expertiseAreas: [{
    type: String,
    trim: true
  }],
  skills: {
    type: Map,
    of: Number,
    default: {}
  },
  successMetrics: {
    type: successMetricsSchema,
    default: () => ({})
  },
  bio: {
    type: String,
    maxlength: [1000, 'Bio cannot be more than 1000 characters']
  },
  education: [{
    institution: String,
    degree: String,
    field: String,
    year: Number
  }],
  rating: {
    average: { type: Number, default: 0, min: 0, max: 5 },
    count: { type: Number, default: 0 }
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  isAcceptingNewMentees: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Indexes for better query performance
mentorProfileSchema.index({ user: 1 });
mentorProfileSchema.index({ 'successMetrics.successRate': -1 });
mentorProfileSchema.index({ expertiseAreas: 1 });
mentorProfileSchema.index({ isAcceptingNewMentees: 1 });

// Static method to get top mentors
mentorProfileSchema.statics.getTopMentors = function(limit = 10) {
  return this.find({ 
    'successMetrics.successRate': { $gte: 80 },
    isAcceptingNewMentees: true 
  })
  .sort({ 'successMetrics.successRate': -1 })
  .limit(limit)
  .populate('user', 'firstName lastName avatar email');
};

// Instance method to update success metrics
mentorProfileSchema.methods.updateSuccessMetrics = function(newPlacement) {
  this.successMetrics.studentsPlaced += 1;
  
  // Update average time to job
  const totalTime = this.successMetrics.avgTimeToJob * (this.successMetrics.studentsPlaced - 1);
  this.successMetrics.avgTimeToJob = (totalTime + newPlacement.timeToJob) / this.successMetrics.studentsPlaced;
  
  return this.save();
};

export default mongoose.model('MentorProfile', mentorProfileSchema);
