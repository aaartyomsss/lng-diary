import { APIGatewayProxyEvent } from 'aws-lambda';

interface MockApiEventFactoryParams {
  method: 'get' | 'post' | 'delete' | 'patch' | 'put';
  path: string;
  body?: string | null;
  authHeader?: string | null;
}

export const mockApiEventFactory = (params: MockApiEventFactoryParams): APIGatewayProxyEvent => {
  const { method, path, body = null, authHeader } = params;
  return {
    httpMethod: method,
    body,
    headers: {
      ...(authHeader && { Authorization: authHeader }),
    },
    isBase64Encoded: false,
    multiValueHeaders: {},
    multiValueQueryStringParameters: {},
    path,
    pathParameters: {},
    queryStringParameters: {},
    requestContext: {
      accountId: '123456789012',
      apiId: '1234',
      authorizer: {},
      httpMethod: method,
      identity: {
        accessKey: '',
        accountId: '',
        apiKey: '',
        apiKeyId: '',
        caller: '',
        clientCert: {
          clientCertPem: '',
          issuerDN: '',
          serialNumber: '',
          subjectDN: '',
          validity: { notAfter: '', notBefore: '' },
        },
        cognitoAuthenticationProvider: '',
        cognitoAuthenticationType: '',
        cognitoIdentityId: '',
        cognitoIdentityPoolId: '',
        principalOrgId: '',
        sourceIp: '',
        user: '',
        userAgent: '',
        userArn: '',
      },
      path,
      protocol: 'HTTP/1.1',
      requestId: 'c6af9ac6-7b61-11e6-9a41-93e8deadbeef',
      requestTimeEpoch: 1428582896000,
      resourceId: '123456',
      resourcePath: path,
      stage: 'dev',
    },
    resource: '',
    stageVariables: {},
  };
};
