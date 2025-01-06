import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { z } from 'zod';
import bcrypt from 'bcrypt';
import { PrismaClient } from '@prisma/client';

const postUserPayloadSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(32),
  confirmPassword: z.string().min(8).max(32),
});

export const lambdaHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  if (!event.body) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: 'Invalid body',
      }),
    };
  }
  const body = JSON.parse(event.body);
  const parsedBody = postUserPayloadSchema.safeParse(body);

  if (!parsedBody.success) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: 'Invalid body',
      }),
    };
  }

  const { email, password, confirmPassword } = parsedBody.data;

  if (confirmPassword !== password) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: 'Passwords do not match',
      }),
    };
  }

  try {
    await createUser(email, password);

    return {
      statusCode: 201,
      body: JSON.stringify({
        message: 'User created',
      }),
    };
  } catch (err) {
    console.log(err);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: 'some error happened',
      }),
    };
  }
};

const createUser = async (email: string, password: string) => {
  const hashedPassword = await bcrypt.hash(password, 12);
  const prisma = new PrismaClient();
  const user = await prisma.user.create({
    data: {
      email,
      passwordHash: hashedPassword,
    },
  });
};
