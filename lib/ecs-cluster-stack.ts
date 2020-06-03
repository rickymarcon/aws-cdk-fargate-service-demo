import * as cdk from '@aws-cdk/core';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as ecs from '@aws-cdk/aws-ecs';
import * as ecsPatterns from '@aws-cdk/aws-ecs-patterns';

export class EcsClusterStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const vpc = new ec2.Vpc(this, 'NamedVPC', {
      maxAzs: 3,
    });

    const cluster = new ecs.Cluster(this, 'NamedCluster', {
      vpc,
    });

    // Create a load-balanced Fargate service and make it public
    new ecsPatterns.ApplicationLoadBalancedFargateService(
      this,
      'NamedFargateService',
      {
        cluster,
        cpu: 512, // Default is 256
        desiredCount: 6,
        taskImageOptions: {
          image: ecs.ContainerImage.fromRegistry('amazon/amazon-ecs-sample'),
        },
        memoryLimitMiB: 2048, // Default is 512,
        publicLoadBalancer: true,
      }
    );
  }
}
