const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

class AuthViewModel {
  async registerUser(email, password) {
    const saltRounds = 10; 
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const user = new User({
      email,
      password: hashedPassword,
    });

    await user.save();

   
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    return { token };
  }

  async loginUser(email, password) {
    const user = await User.findOne({ email });

    if (!user) {
      throw new Error('Invalid credentials');
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      throw new Error('Invalid credentials');
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    return { token };
  }
}

module.exports = new AuthViewModel();
