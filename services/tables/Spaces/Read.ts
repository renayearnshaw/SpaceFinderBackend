import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Context,
} from 'aws-lambda';
import { DynamoDB } from 'aws-sdk';

const TABLE_NAME = process.env.TABLE_NAME;
const PRIMARY_KEY = process.env.PRIMARY_KEY;
const dbClient = new DynamoDB.DocumentClient();

// This lambda is used with API Gateway
export async function handler(
  event: APIGatewayProxyEvent,
  context: Context
): Promise<APIGatewayProxyResult> {
  const result: APIGatewayProxyResult = {
    statusCode: 200,
    body: '',
  };

  try {
    if (event.queryStringParameters) {
      if (PRIMARY_KEY! in event.queryStringParameters) {
        const primaryKeyValue = event.queryStringParameters[PRIMARY_KEY!];
        // Read the entity with this primary key in the DynamoDB table
        const response = await dbClient
          .query({
            TableName: TABLE_NAME!,
            KeyConditionExpression: '#primaryKeyName = :primaryKeyValue',
            ExpressionAttributeNames: {
              '#primaryKeyName': PRIMARY_KEY!,
            },
            ExpressionAttributeValues: {
              ':primaryKeyValue': primaryKeyValue,
            },
          })
          .promise();
          result.body = JSON.stringify(response);
      }
    } else {
      // Read all entities in the DynamoDB table
      const response = await dbClient
        .scan({
          TableName: TABLE_NAME!,
        })
        .promise();
        result.body = JSON.stringify(response);
    }
  } catch (error) {
    // As of TypeScript 4.0 the type of a catch clause variable is 'unknown',
    // so we must use type checking at runtime
    if (error instanceof Error) {
      result.body = error.message;
    } else {
      result.body = String(error);
    }
  }

  return result;
}
