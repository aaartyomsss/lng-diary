import jwt from 'jsonwebtoken';

export const generateJwt = (userId: string) => {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error('Invalid configuration');

  const data = {
    timestamp: Date.now(),
    userId,
  };

  const token = jwt.sign(data, secret);

  return token;
};

export const decodeJwt = (token: string) => {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error('Invalid configuration');

  const payload = jwt.verify(token, secret);

  if (typeof payload === 'object') {
    return payload;
  }
};
