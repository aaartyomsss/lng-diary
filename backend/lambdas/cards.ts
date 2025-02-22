import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { extractUserFromEvent } from './utils/userExtractor';
import { PrismaClient } from '@prisma/client';

/**
 *
 * Event doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html#api-gateway-simple-proxy-for-lambda-input-format
 * @param {Object} event - API Gateway Lambda Proxy Input Format
 *
 * Return doc: https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html
 * @returns {Object} object - API Gateway Lambda Proxy Output Format
 *
 */

export const lambdaHandler = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  const user = extractUserFromEvent(event);

  if (!user) {
    return {
      statusCode: 403,
      body: JSON.stringify({
        message: 'Unauthenticated',
      }),
    };
  }

  const prisma = new PrismaClient();

  const userFlashcards = await prisma.flashcard.findMany({
    where: {
      user: user.id,
    },
    select: {
      firstLanguageTranslation: true,
      targetLanguageTranslation: true,
    },
  });

  try {
    return {
      statusCode: 200,
      body: JSON.stringify(userFlashcards),
    };
  } catch (err) {
    console.log(err);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: 'Error happened',
      }),
    };
  }
};
