#!/usr/bin/env node
import 'source-map-support/register';
import * as dotenv from 'dotenv';
import * as cdk from '@aws-cdk/core';
import { EcsFargateStack } from '../lib/ecs-fargate-stack';
import { PipelineStack } from '../lib/pipeline-stack';

dotenv.config();

const app = new cdk.App();
const cluster = new EcsFargateStack(app, 'EcsFargateStack', {});

new PipelineStack(app, 'PipelineStack', {});
