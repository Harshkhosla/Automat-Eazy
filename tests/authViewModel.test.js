const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const AuthViewModel = require('../viewmodels/AuthViewModel');

jest.mock('bcryptjs'); // Mock bcryptjs

describe('Auth ViewModel', () => {
  describe('registerUser', () => {
    it('should hash the password and save the user', async () => {
      bcrypt.hash.mockImplementation((password, saltRounds) => {
        return Promise.resolve(`hashed_${password}_${saltRounds}`);
      });

      const mockUserSave = jest.fn();
      User.prototype.save = mockUserSave;

      const result = await AuthViewModel.registerUser('test@example.com', 'password123');

      expect(bcrypt.hash).toHaveBeenCalledWith('password123', 10); 
      expect(mockUserSave).toHaveBeenCalled();
      expect(result).toHaveProperty('token');
    });
  });

  describe('loginUser', () => {
    it('should return a token for valid credentials', async () => {
      // This will return true
      bcrypt.compare = jest.fn().mockResolvedValue(true);

      const mockUser = {
        email: 'test@example.com',
        password: await bcrypt.hash('password123', 10),
      };

      User.findOne = jest.fn().mockResolvedValue(mockUser);

      const result = await AuthViewModel.loginUser('test@example.com', 'password123');

      expect(result).toHaveProperty('token');
    });

    it('should throw an error for invalid credentials', async () => {
      bcrypt.compare = jest.fn().mockResolvedValue(false);

      User.findOne = jest.fn().mockResolvedValue(null);

      await expect(AuthViewModel.loginUser('test@example.com', 'password123')).rejects.toThrow(
        'Invalid credentials'
      );
    });
  });
});
