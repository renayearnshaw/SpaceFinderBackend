import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Context,
} from 'aws-lambda';
import { DynamoDB } from 'aws-sdk';
import { v4 } from 'uuid';
import { MissingFieldError, validateSpace } from '../../utils/spaceValidator';

const TABLE_NAME = process.env.TABLE_NAME;
const dbClient = new DynamoDB.DocumentClient();

// This lambda is used with API Gateway
export async function handler(
  event: APIGatewayProxyEvent,
  context: Context
): Promise<APIGatewayProxyResult> {
  const result: APIGatewayProxyResult = {
    statusCode: 200,
    body: 'Hello from DynamoDB',
  };

  try {
    // An item to be inserted into the DynamoDB table.
    // It contains a primary key field called 'spaceId' with a unique value.
    const item =
      typeof event.body === 'object' ? event.body : JSON.parse(event.body);
    item.spaceId = v4();
    validateSpace(item);

    // Insert item into the DynamoDB table
    await dbClient
      .put({
        TableName: TABLE_NAME!,
        Item: item,
      })
      .promise();

    result.body = JSON.stringify(`Created item with id: ${item.spaceId}`);
  } catch (error) {
    if (error instanceof MissingFieldError) {
      result.statusCode = 403;
      result.body = error.message;
    } else {
      result.statusCode = 500;
      // As of TypeScript 4.0 the type of a catch clause variable is 'unknown',
      // so we must use type checking at runtime
      if (error instanceof Error) {
        result.body = error.message;
      } else {
        result.body = String(error);
      }
    }
  }

  return result;
}
