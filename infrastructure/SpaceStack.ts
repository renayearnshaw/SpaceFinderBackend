import { Stack, StackProps } from 'aws-cdk-lib';
import { LambdaIntegration, RestApi } from 'aws-cdk-lib/aws-apigateway';
import { PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { NodejsFunction } from 'aws-cdk-lib/aws-lambda-nodejs';
import { Construct } from 'constructs';
import { join } from 'path';
import { GenericTable } from './GenericTable';

export class SpaceStack extends Stack {
  private api = new RestApi(this, 'SpaceApi');
  private spacesTable = new GenericTable(this, {
    name: 'Spaces',
    primaryKey: 'spaceId',
    createLambdaPath: 'Create',
    readLambdaPath: 'Read',
  });

  constructor(scope: Construct, id: string, props: StackProps) {
    super(scope, id, props);

    const helloLambda = new NodejsFunction(this, 'helloLambda', {
      entry: join(__dirname, '..', 'services', 'node-lambda', 'hello.ts'),
      handler: 'handler',
    });
    // The lambda must be given permission to list all our S3 buckets
    const s3ListPolicy = new PolicyStatement();
    s3ListPolicy.addActions('s3:ListAllMyBuckets');
    s3ListPolicy.addResources('*');
    helloLambda.addToRolePolicy(s3ListPolicy);

    const lambdaIntegration = new LambdaIntegration(helloLambda);
    const lambdaResource = this.api.root.addResource('hello');
    lambdaResource.addMethod('GET', lambdaIntegration);

    const spaceResource = this.api.root.addResource('spaces');
    // When a POST request is made against the 'spaces' endpoint
    // an entity will be created in the 'Spaces' table in DynamoDB
    spaceResource.addMethod('POST', this.spacesTable.createLambdaIntegration);
    // A GET request made against the 'spaces' endpoint will return a single entity
    spaceResource.addMethod('GET', this.spacesTable.readLambdaIntegration);
  }
}
