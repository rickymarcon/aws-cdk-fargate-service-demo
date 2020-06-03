#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { EcsClusterStack } from '../lib/ecs-cluster-stack';

const app = new cdk.App();
new EcsClusterStack(app, 'EcsClusterStack', {
  serviceId: 'my-service',
});
