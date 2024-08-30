const Joi = require('joi');
const AuthViewModel = require('../viewmodels/AuthViewModel');

// JOI validation schema
const userSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
});

class AuthController {
  async register(req, res) {
    // Validate input data
    const { error } = userSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const { email, password } = req.body;

    try {
      // Use ViewModel to handle business logic
      const result = await AuthViewModel.registerUser(email, password);
      res.status(201).json(result);
    } catch (err) {
      if (err.code === 11000) { // MongoDB duplicate key error code
        return res.status(400).json({ message: 'User already exists' });
      }
      console.error(err.message);
      res.status(500).json({ message: 'Server error' });
    }
  }

  async login(req, res) {
    // Validate input data
    const { error } = userSchema.validate(req.body);
    if (error) return res.status(400).json({ message: error.details[0].message });

    const { email, password } = req.body;

    try {
      // Use ViewModel to handle business logic
      const result = await AuthViewModel.loginUser(email, password);
      res.status(200).json(result);
    } catch (err) {
      res.status(400).json({ message: err.message });
    }
  }
}

module.exports = new AuthController();
