import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { lambdaHandler } from '../../user';
import { expect, describe, it, jest } from '@jest/globals';
import bcrypt from 'bcrypt';

const bcryptSpy = jest.spyOn(bcrypt, 'hash');

const mockEvent = (body: string | null): APIGatewayProxyEvent => {
    return {
        httpMethod: 'post',
        body: body,
        headers: {},
        isBase64Encoded: false,
        multiValueHeaders: {},
        multiValueQueryStringParameters: {},
        path: '/user/create',
        pathParameters: {},
        queryStringParameters: {},
        requestContext: {
            accountId: '123456789012',
            apiId: '1234',
            authorizer: {},
            httpMethod: 'get',
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
            path: '/user/create',
            protocol: 'HTTP/1.1',
            requestId: 'c6af9ac6-7b61-11e6-9a41-93e8deadbeef',
            requestTimeEpoch: 1428582896000,
            resourceId: '123456',
            resourcePath: '/user/create',
            stage: 'dev',
        },
        resource: '',
        stageVariables: {},
    };
};

describe('Unit test for user creation', function () {
    it('Expect error if body is not defined', async () => {
        const event: APIGatewayProxyEvent = mockEvent(null);
        const result: APIGatewayProxyResult = await lambdaHandler(event);

        expect(result.statusCode).toEqual(400);
        expect(result.body).toEqual(
            JSON.stringify({
                message: 'Invalid body',
            }),
        );
    });

    it('Expect error if body is not aligned with schema', async () => {
        const event: APIGatewayProxyEvent = mockEvent(JSON.stringify({ user: 'Bla bla' }));
        const result: APIGatewayProxyResult = await lambdaHandler(event);

        expect(result.statusCode).toEqual(400);
        expect(result.body).toEqual(
            JSON.stringify({
                message: 'Invalid body',
            }),
        );
    });

    it('Expect error if confirmation passwords do not align', async () => {
        const event: APIGatewayProxyEvent = mockEvent(
            JSON.stringify({ email: 'user@gmail.com', password: '123456789', confirmPassword: '987654321' }),
        );
        const result: APIGatewayProxyResult = await lambdaHandler(event);

        expect(result.statusCode).toEqual(400);
        expect(result.body).toEqual(
            JSON.stringify({
                message: 'Passwords do not match',
            }),
        );
    });

    it('User creation function should be called with hashed password', async () => {
        const event: APIGatewayProxyEvent = mockEvent(
            JSON.stringify({ email: 'user@gmail.com', password: '12345678', confirmPassword: '12345678' }),
        );
        const result: APIGatewayProxyResult = await lambdaHandler(event);

        expect(bcryptSpy).toBeCalledWith('12345678', 12);
        expect(result.statusCode).toEqual(201);
        expect(result.body).toEqual(
            JSON.stringify({
                message: 'User created',
            }),
        );
    });
});
