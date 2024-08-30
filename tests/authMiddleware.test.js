const jwt = require('jsonwebtoken');
const authMiddleware = require('../middleware/authMiddleware');

describe('Auth Middleware', () => {
  it('should authenticate a valid token', () => {
    const req = {
      header: jest.fn().mockReturnValue('Bearer valid-token'),
    };
    const res = {};
    const next = jest.fn();

    jwt.verify = jest.fn().mockReturnValue({ id: 'user123' });

    authMiddleware.authMiddleware(req, res, next);

    expect(req.user).toEqual('user123');
    expect(next).toHaveBeenCalled();
  });

  it('should not authenticate an invalid token', () => {
    const req = {
      header: jest.fn().mockReturnValue('Bearer invalid-token'),
    };
    const res = {
        status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
        const next = jest.fn();

    jwt.verify = jest.fn().mockImplementation(() => {
          throw new Error('Invalid token');
    });

    authMiddleware.authMiddleware(req, res, next);

        expect(res.status).toHaveBeenCalledWith(401);
expect(res.json).toHaveBeenCalledWith({ message: 'Invalid token' });
    expect(next).not.toHaveBeenCalled();
  });
});
