import { APIGatewayProxyEvent } from 'aws-lambda';

export const getBody = (event: APIGatewayProxyEvent) => {
  return typeof event.body === 'object' ? event.body : JSON.parse(event.body);
};
