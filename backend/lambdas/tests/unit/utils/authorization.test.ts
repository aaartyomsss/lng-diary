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
    const token = generateJwt('uuid');
    const parts = token.split('.');
    expect(parts.length).toBe(3);
  });

  it('Token can be verified', () => {
    const token = generateJwt('uuid-v4-test');
    const decoded = decodeJwt(token);

    expect(decoded).toBeDefined();
    expect(decoded?.userId).toBe('uuid-v4-test');
  });
});

afterEach(() => {
  process.env = originalEnv;
});
