import { Stack, StackProps } from "aws-cdk-lib";
import { Construct } from "constructs";
import {
  Code,
  Function as LambdaFunction,
  Runtime,
} from "aws-cdk-lib/aws-lambda";
import { join } from "path";
import { LambdaIntegration, RestApi } from "aws-cdk-lib/aws-apigateway";

export class SpaceStack extends Stack {
  private api = new RestApi(this, "SpaceApi");

  constructor(scope: Construct, id: string, props: StackProps) {
    super(scope, id, props);

    const helloLambda = new LambdaFunction(this, "helloLambda", {
      runtime: Runtime.NODEJS_14_X,
      code: Code.fromAsset(join(__dirname, "..", "services", "hello")),
      handler: "hello.main",
    });

    const lambdaIntegration = new LambdaIntegration(helloLambda);
    const lambdaResource = this.api.root.addResource("hello");
    lambdaResource.addMethod("GET", lambdaIntegration);
  }
}
