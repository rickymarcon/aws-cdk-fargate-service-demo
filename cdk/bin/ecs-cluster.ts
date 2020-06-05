#!/usr/bin/env node
import 'source-map-support/register';
import * as dotenv from 'dotenv';
import * as cdk from '@aws-cdk/core';
import { EcsClusterStack } from '../lib/ecs-cluster-stack';
import { EcsPipelineStack } from '../lib/ecs-pipeline-stack';

dotenv.config();

const app = new cdk.App();
const cluster = new EcsClusterStack(app, 'EcsClusterStack', {});

new EcsPipelineStack(app, 'EcsPipelineStack', {});
