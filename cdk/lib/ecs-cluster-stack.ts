import * as cdk from '@aws-cdk/core';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as ecs from '@aws-cdk/aws-ecs';
import * as ecsPatterns from '@aws-cdk/aws-ecs-patterns';
import * as ecr from '@aws-cdk/aws-ecr-assets';
import * as path from 'path';

interface EcsClusterStackProps extends cdk.StackProps {
  serviceId: string;
}

export class EcsClusterStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props: EcsClusterStackProps) {
    super(scope, id, props);

    const imageDirectory = path.resolve(`../${props.serviceId}`);

    const asset = new ecr.DockerImageAsset(this, 'NamedBuildImage', {
      directory: imageDirectory,
    });

    const vpc = new ec2.Vpc(this, 'NamedVPC', {
      maxAzs: 2,
    });

    const cluster = new ecs.Cluster(this, 'NamedCluster', {
      vpc,
    });

    // Create a load-balanced Fargate service and make it public
    const fargateService = new ecsPatterns.ApplicationLoadBalancedFargateService(
      this,
      'NamedFargateService',
      {
        cluster,
        serviceName: 'My Service',
        desiredCount: 1,
        cpu: 256, // default
        memoryLimitMiB: 512, // default
        taskImageOptions: {
          image: ecs.ContainerImage.fromDockerImageAsset(asset),
          enableLogging: true, // default
          containerPort: 80, // default
        },
        publicLoadBalancer: true,
      }
    );
  }
}
