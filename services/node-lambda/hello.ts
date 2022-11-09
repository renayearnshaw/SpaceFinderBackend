import { S3 } from 'aws-sdk';

export async function handler(event: any, context: any) {
  // Use the AWS SDK to list all our S3 buckets
  const s3Client = new S3();
  const buckets = await s3Client.listBuckets().promise();
  console.log('Got an event: ' + event);

  return {
    statusCode: 200,
    body: 'Here are your buckets: ' + JSON.stringify(buckets.Buckets),
  };
}
