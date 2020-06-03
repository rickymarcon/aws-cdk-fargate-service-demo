import { expect as expectCDK, haveResource } from '@aws-cdk/assert';
import * as cdk from '@aws-cdk/core';
import { EcsClusterStack } from '../lib/ecs-cluster-stack';

describe('cdk ecs cluster', () => {
  let app: cdk.App;
  let stack: cdk.Stack;

  beforeAll(() => {
    app = new cdk.App();
    stack = new EcsClusterStack(app, 'EcsClusterStack');
  });

  test('creates a vpc with cidr 10.0.0.0/16', () => {
    expectCDK(stack).to(
      haveResource('AWS::EC2::VPC', {
        CidrBlock: '10.0.0.0/16',
      })
    );
  });

  test('creates an ecs cluster', () => {
    expectCDK(stack).to(haveResource('AWS::ECS::Cluster'));
  });
});
