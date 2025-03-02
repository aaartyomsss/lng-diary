import { expect, describe, it, beforeEach, jest, afterEach } from '@jest/globals';
import { decodeJwt, generateJwt } from '../../../utils/authorization';
import { LlmServcice } from '@/services/LlmService';
import exp from 'constants';

const originalEnv = process.env;

beforeEach(() => {
  jest.resetModules();
  process.env = {
    ...originalEnv,
    EXTERNAL_LLM_API_KEY: 'mock',
  };
});

describe('LlmService', () => {
  it('Picks out corrected text and JSON', () => {
    const input = `
      Corrected text: Se on ehkä tosi pitkä lause ja mä en tiedä voinko kirjoittaa sen kaiken itse | JSON with translations: {"maybe": "ehkä", "sentence": "lause", "can": "voinko", "write": "kirjoittaa", "it": "sen", "all": "kaiken", "myself": "itse"}
    `;

    const res = LlmServcice.parseModelResponse(input);
    expect(res.text).toBe('Se on ehkä tosi pitkä lause ja mä en tiedä voinko kirjoittaa sen kaiken itse');
    expect(res.transaltions).toBe(
      '{"maybe": "ehkä", "sentence": "lause", "can": "voinko", "write": "kirjoittaa", "it": "sen", "all": "kaiken", "myself": "itse"}',
    );
  });
});

afterEach(() => {
  process.env = originalEnv;
});
