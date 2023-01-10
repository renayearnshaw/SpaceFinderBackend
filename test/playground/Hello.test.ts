import { APIGatewayProxyEvent } from 'aws-lambda';
import { handler } from '../../services/tables/Spaces/Delete';

const event: APIGatewayProxyEvent = {
  queryStringParameters: {
    spaceId: '5c910bb9-6ea8-49cc-b5be-c1fa1ea75f82',
  },
} as any;

// Run the lambda function locally so that we can debug it
handler(event, {} as any).then((apiResult) => {
  // format the body for easier viewing
  const items = JSON.parse(apiResult.body);
  // Add a console.log call so that we can put a breakpoint here
  console.log(123);
});
