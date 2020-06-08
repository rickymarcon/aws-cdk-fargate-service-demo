import * as cdk from '@aws-cdk/core';
import * as ec2 from '@aws-cdk/aws-ec2';
import * as ecs from '@aws-cdk/aws-ecs';
import * as ecsPatterns from '@aws-cdk/aws-ecs-patterns';
import * as ecr from '@aws-cdk/aws-ecr';
import * as ecrAssets from '@aws-cdk/aws-ecr-assets';
import * as path from 'path';

export class EcsFargateStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props: cdk.StackProps) {
    super(scope, id, props);

    const directory = path.resolve(process.cwd(), '..', process.env.SERVICE_ID);
    const asset = new ecrAssets.DockerImageAsset(this, 'MyBuildImage', {
      directory,
    });

    const vpc = new ec2.Vpc(this, 'MyVPC', { maxAzs: 2 });
    const cluster = new ecs.Cluster(this, 'MyCluster', { vpc });

    // Create a load-balanced Fargate service and make it public
    const fargateService = new ecsPatterns.ApplicationLoadBalancedFargateService(
      this,
      'MyFargateService',
      {
        cluster,
        desiredCount: 2,
        cpu: 256, // default
        memoryLimitMiB: 512, // default
        taskImageOptions: {
          image: ecs.ContainerImage.fromDockerImageAsset(asset),
          enableLogging: true, // default
          containerPort: 80, // default
        },
        publicLoadBalancer: true, // default
      }
    );

    // Setup AutoScaling policy
    const scaling = fargateService.service.autoScaleTaskCount({
      maxCapacity: 2,
    });
    scaling.scaleOnCpuUtilization('CpuScaling', {
      targetUtilizationPercent: 50,
      scaleInCooldown: cdk.Duration.seconds(60),
      scaleOutCooldown: cdk.Duration.seconds(60),
    });
  }
}
