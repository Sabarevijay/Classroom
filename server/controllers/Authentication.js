import User from '../models/Authentication.js';
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
import dotenv from 'dotenv'

dotenv.config()

const client = new OAuth2Client(process.env.VITE_GOOGLE_CLIENT_ID||'690691222870-8fmk6jvbsp5mkujc28s1tivqvqito4be.apps.googleusercontent.com'); // Fixed env variable name

console.log("Google Client ID:", process.env.VITE_GOOGLE_CLIENT_ID);


export const googleLogin = async (req, res) => {
  try {
    const { token } = req.body;
    
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: process.env.VITE_GOOGLE_CLIENT_ID,
    });
    
    const { email, name, sub: googleId } = ticket.getPayload();

    // Determine role based on the character before '@'
    let role = 'user';
    const charBeforeAt = email.charAt(email.indexOf('@') - 1);
    if (/[a-zA-Z]/.test(charBeforeAt)) {
      role = 'admin'; // Alphabet before @ means admin
    } else if (/[0-9]/.test(charBeforeAt)) {
      role = 'user'; // Number before @ means user
    }

    let user = await User.findOne({ email });
    if (!user) {
      user = new User({
        googleId,
        email,
        name,
        role
      });
      await user.save();
    }

    const jwtToken = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    const redirectUrl = role === 'admin' ? '/home' : '/user';
    console.log('Backend Response:', { token: jwtToken, redirectUrl }); // Debug log

    res.json({ token: jwtToken, redirectUrl });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};