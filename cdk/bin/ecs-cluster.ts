#!/usr/bin/env node
import 'source-map-support/register';
import * as dotenv from 'dotenv';
import * as cdk from '@aws-cdk/core';
import { EcsClusterStack } from '../lib/ecs-cluster-stack';
import { EcsPipelineStack } from '../lib/ecs-pipeline-stack';

dotenv.config();

const app = new cdk.App();
const cluster = new EcsClusterStack(app, 'EcsClusterStack', {
  serviceId: process.env.SERVICE_ID,
});

new EcsPipelineStack(app, 'EcsPipelineStack', {
  oauthToken: process.env.GITHUB_TOKEN,
  repoOwner: process.env.REPO_OWNER,
  repoName: process.env.REPO_NAME,
  branch: process.env.BRANCH,
});
