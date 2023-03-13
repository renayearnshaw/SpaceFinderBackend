import { APIGatewayProxyEvent } from 'aws-lambda';

export async function handler(event: APIGatewayProxyEvent, context: any) {
  if (isAuthorised(event)) {
    return {
      statusCode: 200,
      body: JSON.stringify('You are authorised'),
    };
  } else {
    return {
      statusCode: 401,
      body: JSON.stringify('You are NOT authorised'),
    };
  }
}

const isAuthorised = (event: APIGatewayProxyEvent) => {
  const groups = event.requestContext.authorizer?.claims['cognito:groups'];
  if (groups) {
    return (groups as string).includes('admin');
  } else {
    return false;
  }
};
