import { CfnOutput } from 'aws-cdk-lib';
import {
  CognitoUserPoolsAuthorizer,
  RestApi,
} from 'aws-cdk-lib/aws-apigateway';
import { UserPool, UserPoolClient } from 'aws-cdk-lib/aws-cognito';
import { Construct } from 'constructs';

export class SpaceAuthorizer {
  private scope: Construct;
  private api: RestApi;

  private userPool: UserPool;
  private userPoolClient: UserPoolClient;
  public authorizer: CognitoUserPoolsAuthorizer;

  constructor(scope: Construct, api: RestApi) {
    this.scope = scope;
    this.api = api;
    this.initialse();
  }

  private initialse() {
    this.createUserPool();
    this.addUserPoolClient();
    this.createAuthorizer();
  }

  private createUserPool() {
    this.userPool = new UserPool(this.scope, 'SpaceUserPool', {
      userPoolName: 'SpaceUserPool',
      selfSignUpEnabled: true,
      signInAliases: {
        username: true,
        email: true,
      },
    });
    // create an output in the stack with a key of 'UserPoolId'
    new CfnOutput(this.scope, 'UserPoolId', {
      value: this.userPool.userPoolId,
    });
  }

  private addUserPoolClient() {
    // Configure an app client used by the user pool
    this.userPoolClient = this.userPool.addClient('SpaceUserPool-client', {
      userPoolClientName: 'SpaceUserPool-client',
      authFlows: {
        adminUserPassword: true,
        custom: true,
        userPassword: true,
        userSrp: true,
      },
      generateSecret: false,
    });
    // create an output in the stack with a key of 'UserPoolClientId'
    new CfnOutput(this.scope, 'UserPoolClientId', {
      value: this.userPoolClient.userPoolClientId,
    });
  }

  private createAuthorizer() {
    this.authorizer = new CognitoUserPoolsAuthorizer(
      this.scope,
      'SpaceAuthorizer',
      {
        cognitoUserPools: [this.userPool],
        authorizerName: 'SpaceAuthorizer',
        identitySource: 'method.request.header.Authorization',
      }
    );
    this.authorizer._attachToApi(this.api);
  }
}
