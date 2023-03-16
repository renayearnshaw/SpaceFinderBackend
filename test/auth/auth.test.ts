import { AuthService } from './AuthService';
import { config } from './config';
import * as AWS from 'aws-sdk';

AWS.config.region = config.REGION;

const getBuckets = async () => {
  let buckets;
  try {
    buckets = await new AWS.S3().listBuckets().promise();
  } catch (error) {
    buckets = undefined;
  }
  return buckets;
};

const callStuff = async () => {
  const authService = new AuthService();

  const user = await authService.login(
    config.TEST_USER_NAME,
    config.TEST_USER_PASSWORD
  );
  await authService.getTemporaryAWSCredentials(user);
  const ourCredentials = AWS.config.credentials;
  const buckets = await getBuckets();
  const a = 5;
};

callStuff();
