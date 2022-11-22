import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Context,
} from 'aws-lambda';
import { DynamoDB } from 'aws-sdk';
import { v4 } from 'uuid';

const TABLE_NAME = process.env.TABLE_NAME
const dbClient = new DynamoDB.DocumentClient();

// This lambda is used with API Gateway
export async function handler(
  event: APIGatewayProxyEvent,
  context: Context
): Promise<APIGatewayProxyResult> {
  // An item to be inserted into the DynamoDB table.
  // It contains a primary key field called 'spaceId' with a unique value.
  const item =
    typeof event.body === 'object' ? event.body : JSON.parse(event.body);
  item.spaceId = v4();

  const result: APIGatewayProxyResult = {
    statusCode: 200,
    body: `Created item with id: ${item.spaceId}`,
  };

  try {
    // Insert item into the DynamoDB table
    await dbClient
      .put({
        TableName: TABLE_NAME!,
        Item: item,
      })
      .promise();
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
