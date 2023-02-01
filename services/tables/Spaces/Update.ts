import {
  APIGatewayProxyEvent,
  APIGatewayProxyResult,
  Context,
} from 'aws-lambda';
import { DynamoDB } from 'aws-sdk';
import { getBody } from '../../utils/eventBody';

const TABLE_NAME = process.env.TABLE_NAME as string;
const PRIMARY_KEY = process.env.PRIMARY_KEY as string;
const dbClient = new DynamoDB.DocumentClient();

// This lambda is used with API Gateway
export async function handler(
  event: APIGatewayProxyEvent,
  context: Context
): Promise<APIGatewayProxyResult> {
  // An item to be updated in the DynamoDB table.
  // The query string parameter is the primary key of the item to be updated.
  // The body contains the name of a field and the new value.
  const requestBody = getBody(event);
  const primaryKeyValue = event.queryStringParameters?.[PRIMARY_KEY];

  const result: APIGatewayProxyResult = {
    statusCode: 200,
    body: '',
  };

  try {
    // Update the item in the DynamoDB table
    if (requestBody && primaryKeyValue) {
      // Get the first field in the object, which should be the name of a field
      const fieldName = Object.keys(requestBody)[0];
      const fieldValue = requestBody[fieldName];
      const response = await dbClient
        .update({
          TableName: TABLE_NAME,
          Key: {
            [PRIMARY_KEY]: primaryKeyValue,
          },
          UpdateExpression: 'set #fieldName = :fieldValue',
          ExpressionAttributeNames: {
            '#fieldName': fieldName,
          },
          ExpressionAttributeValues: {
            ':fieldValue': fieldValue,
          },
          ReturnValues: 'UPDATED_NEW',
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
