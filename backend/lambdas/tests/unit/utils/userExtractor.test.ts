import { describe, expect, it, jest, beforeAll, afterAll } from '@jest/globals';
import { mockApiEventFactory } from '../../factories/mockApiEvent';
import { extractUserFromEvent } from '@/utils/userExtractor';
import { generateJwt } from '@/utils/authorization';

const originalEnv = process.env;

beforeAll(() => {
  jest.resetModules();
  process.env = {
    ...originalEnv,
    JWT_SECRET: 'very-secret-value',
  };
});

describe('userExtractor', () => {
  it('Returns null, if no header has been found', () => {
    const event = mockApiEventFactory({ method: 'get', path: '/test' });
    const user = extractUserFromEvent(event);

    expect(user).toBeNull();
  });

  it('Returns undefined if invalid token is provided', () => {
    const event = mockApiEventFactory({ method: 'get', path: '/test', authHeader: 'bla bla bla' });
    const user = extractUserFromEvent(event);

    expect(user).toBe(null);
  });

  it('Returns user, if everything is on point', () => {
    const token = generateJwt(1);
    const event = mockApiEventFactory({ method: 'get', path: '/test', authHeader: token });
    const user = extractUserFromEvent(event);

    expect(user).toBeDefined();
    expect(user?.userId).toBe(1);
  });
});

afterAll(() => {
  process.env = originalEnv;
});
