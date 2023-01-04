import { APIGatewayProxyEvent } from 'aws-lambda';
import { handler } from '../../services/tables/Spaces/Update';

const event: APIGatewayProxyEvent = {
  queryStringParameters: {
    spaceId: '97f6edbe-beac-4ca9-a9d2-16411491463a',
  },
  body: {
    location: 'new location'
  }
} as any;

// Run the lambda function locally so that we can debug it
handler(event, {} as any).then((apiResult) => {
  // format the body for easier viewing
  const items = JSON.parse(apiResult.body);
  // Add a console.log call so that we can put a breakpoint here
  console.log(123);
});
