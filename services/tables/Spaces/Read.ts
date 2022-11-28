import {
  APIGatewayProxyEvent,
  APIGatewayProxyEventQueryStringParameters,
  APIGatewayProxyResult,
  Context,
} from 'aws-lambda';
import { DynamoDB } from 'aws-sdk';

const TABLE_NAME = process.env.TABLE_NAME;
const PRIMARY_KEY = process.env.PRIMARY_KEY;
const dbClient = new DynamoDB.DocumentClient();

// This lambda is used with API Gateway
export const handler = async (
  event: APIGatewayProxyEvent,
  context: Context
): Promise<APIGatewayProxyResult> => {
  const result: APIGatewayProxyResult = {
    statusCode: 200,
    body: '',
  };

  try {
    if (event.queryStringParameters) {
      if (PRIMARY_KEY! in event.queryStringParameters) {
        result.body = await readEntityWithPrimaryKey(
          event.queryStringParameters
        );
      } else {
        result.body = await readEntityWithSecondaryKey(
          event.queryStringParameters
        );
      }
    } else {
      result.body = await readAllEntities();
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
};

const readAllEntities = async () => {
  // Read all entities in the DynamoDB table
  const response = await dbClient
    .scan({
      TableName: TABLE_NAME!,
    })
    .promise();
  return JSON.stringify(response);
};

const readEntityWithPrimaryKey = async (
  queryStringParameters: APIGatewayProxyEventQueryStringParameters
) => {
  const primaryKeyValue = queryStringParameters[PRIMARY_KEY!];
  // Read the entity with this primary key in the DynamoDB table
  const response = await dbClient
    .query({
      TableName: TABLE_NAME!,
      KeyConditionExpression: '#keyName = :keyValue',
      ExpressionAttributeNames: {
        '#keyName': PRIMARY_KEY!,
      },
      ExpressionAttributeValues: {
        ':keyValue': primaryKeyValue,
      },
    })
    .promise();
  return JSON.stringify(response);
};

const readEntityWithSecondaryKey = async (
  queryStringParameters: APIGatewayProxyEventQueryStringParameters
) => {
  const secondaryKeyName = Object.keys(queryStringParameters)[0];
  const secondaryKeyValue = queryStringParameters[secondaryKeyName!];
  // Read the entity with this secondary key in the DynamoDB table
  const response = await dbClient
    .query({
      TableName: TABLE_NAME!,
      IndexName: secondaryKeyName,
      KeyConditionExpression: '#keyName = :keyValue',
      ExpressionAttributeNames: {
        '#keyName': secondaryKeyName,
      },
      ExpressionAttributeValues: {
        ':keyValue': secondaryKeyValue,
      },
    })
    .promise();
  return JSON.stringify(response);
};
