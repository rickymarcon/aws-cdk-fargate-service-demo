import {
  expect as expectCDK,
  matchTemplate,
  MatchStyle,
} from '@aws-cdk/assert';
import * as cdk from '@aws-cdk/core';
import * as AwsCdkEcsCluster from '../lib/ecs-cluster-stack';

test('Empty Stack', () => {
  const app = new cdk.App();
  // WHEN
  const stack = new AwsCdkEcsCluster.EcsClusterStack(app, 'MyTestStack');
  // THEN
  expectCDK(stack).to(
    matchTemplate(
      {
        Resources: {},
      },
      MatchStyle.EXACT
    )
  );
});
