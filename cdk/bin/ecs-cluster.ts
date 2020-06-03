#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { ECSClusterStack } from '../lib/ecs-cluster-stack';

const app = new cdk.App();
new ECSClusterStack(app, 'ECSClusterStack', {
  serviceId: 'my-service',
});
