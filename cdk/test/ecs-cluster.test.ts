import { expect as expectCDK, haveResource } from '@aws-cdk/assert';
import * as cdk from '@aws-cdk/core';
import { EcsClusterStack } from '../lib/ecs-cluster-stack';

describe('CDK ECS cluster', () => {
  let app: cdk.App;
  let stack: cdk.Stack;

  beforeAll(() => {
    app = new cdk.App();
    stack = new EcsClusterStack(app, 'EcsClusterStack', {});
  });

  test('creates a VPC with cidr 10.0.0.0/16', () => {
    expectCDK(stack).to(
      haveResource('AWS::EC2::VPC', {
        CidrBlock: '10.0.0.0/16',
      })
    );
  });

  test('creates an ECS cluster', () => {
    expectCDK(stack).to(haveResource('AWS::ECS::Cluster'));
  });

  test('creates an ELB', () => {
    expectCDK(stack).to(
      haveResource('AWS::ElasticLoadBalancingV2::LoadBalancer')
    );
    expectCDK(stack).to(haveResource('AWS::ElasticLoadBalancingV2::Listener'));
    expectCDK(stack).to(
      haveResource('AWS::ElasticLoadBalancingV2::TargetGroup')
    );
  });

  test('allows ingress to cluster from 0.0.0.0/0', () => {
    expectCDK(stack).to(
      haveResource('AWS::EC2::SecurityGroup', {
        SecurityGroupIngress: [
          {
            CidrIp: '0.0.0.0/0',
            Description: 'Allow from anyone on port 80',
            FromPort: 80,
            IpProtocol: 'tcp',
            ToPort: 80,
          },
        ],
      })
    );
  });

  test('creates a task definition', () => {
    expectCDK(stack).to(haveResource('AWS::ECS::TaskDefinition'));
  });

  test('service is created', () => {
    expectCDK(stack).to(
      haveResource('AWS::ECS::Service', {
        LaunchType: 'FARGATE',
        DesiredCount: 1,
      })
    );
  });
});
