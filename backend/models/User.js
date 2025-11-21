import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  userType: { type: String, enum: ['mentee', 'mentor'], required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  avatar: { type: String }
}, { timestamps: true });

export default mongoose.model('User', userSchema);
