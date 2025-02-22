import { expect, describe, it, beforeEach, jest, afterEach } from '@jest/globals';
import { decodeJwt, generateJwt } from '../../../utils/authorization';

const originalEnv = process.env;

beforeEach(() => {
  jest.resetModules();
  process.env = {
    ...originalEnv,
    JWT_SECRET: 'very-secret-value',
  };
});

describe('JWT Auth', function () {
  it('Token is created', () => {
    const token = generateJwt(1);
    const parts = token.split('.');
    expect(parts.length).toBe(3);
  });

  it('Token can be verified', () => {
    const token = generateJwt(2);
    const decoded = decodeJwt(token);

    expect(decoded).toBeDefined();
    expect(decoded?.userId).toBe(2);
  });
});

afterEach(() => {
  process.env = originalEnv;
});
