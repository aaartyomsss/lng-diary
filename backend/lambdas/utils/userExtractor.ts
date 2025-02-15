import { APIGatewayProxyEvent } from 'aws-lambda';
import { decodeJwt } from '@/utils/authorization';

export const extractUserFromEvent = (event: APIGatewayProxyEvent) => {
  const headers = event.headers;
  const authToken = headers['Authorization'];
  if (!authToken) return null;

  const verifiedToken = decodeJwt(authToken);
  return verifiedToken || null;
};
