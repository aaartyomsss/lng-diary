import { describe, expect, it } from '@jest/globals';
import { mockApiEventFactory } from '../factories/mockApiEvent';
import { lambdaHandler } from '@/cards';

import { PrismaClient } from '@prisma/client';
import { generateJwt } from '@/utils/authorization';

beforeAll(async () => {
  const prisma = new PrismaClient();
  await prisma.user.deleteMany();
  await prisma.flashcard.deleteMany();
});

describe('card lambda handler', () => {
  it('returns 403 for unauthenticated user', async () => {
    const event = mockApiEventFactory({ path: '/api/cards', method: 'get' });
    const res = await lambdaHandler(event);

    expect(res.statusCode).toEqual(403);
  });

  it('returns user specific cards', async () => {
    const prisma = new PrismaClient();
    const user = await prisma.user.create({
      data: {
        email: 'example@gmail.com',
        passwordHash: 'hashForTest',
      },
    });

    const flashcards = await prisma.flashcard.createMany({
      data: [
        {
          targetLanguageTranslation: 'Mina',
          firstLanguageTranslation: 'Me',
          userId: user.id,
        },
        {
          targetLanguageTranslation: 'Sina',
          firstLanguageTranslation: 'You',
          userId: user.id,
        },
      ],
    });

    const token = generateJwt(user.id);

    const event = mockApiEventFactory({ path: '/api/cards', method: 'get', authHeader: token });

    const res = await lambdaHandler(event);

    expect(JSON.parse(res.body)).toStrictEqual([
      {
        targetLanguageTranslation: 'Mina',
        firstLanguageTranslation: 'Me',
      },
      {
        targetLanguageTranslation: 'Sina',
        firstLanguageTranslation: 'You',
      },
    ]);
  });
});
