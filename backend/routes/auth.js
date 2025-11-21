import express from 'express';
import User from '../models/User.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

const router = express.Router();

// Demo login - works with any email
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // For demo - auto create user if doesn't exist
    let user = await User.findOne({ email });

    if (!user) {
      const hashedPassword = await bcrypt.hash(password || 'password', 12);
      
      user = await User.create({
        email,
        password: hashedPassword,
        userType: 'mentee',
        firstName: 'Demo',
        lastName: 'User'
      });
    }

    // Generate token
    const token = jwt.sign(
      { userId: user._id }, 
      process.env.JWT_SECRET,
      { expiresIn: '30d' }
    );

    res.json({
      success: true,
      token,
      user: {
        id: user._id,
        email: user.email,
        name: `${user.firstName} ${user.lastName}`,
        userType: user.userType,
        avatar: user.avatar
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

export default router;
