#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { AwsCdkEcsClusterStack } from '../lib/aws-cdk-ecs-cluster-stack';

const app = new cdk.App();
new AwsCdkEcsClusterStack(app, 'AwsCdkEcsClusterStack');
