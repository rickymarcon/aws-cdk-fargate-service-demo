import * as cdk from '@aws-cdk/core';
import * as iam from '@aws-cdk/aws-iam';
import * as codepipeline from '@aws-cdk/aws-codepipeline';
import * as codebuild from '@aws-cdk/aws-codebuild';
import * as codepipelineActions from '@aws-cdk/aws-codepipeline-actions';

export class PipelineStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props: cdk.StackProps) {
    super(scope, id, props);

    const pipeline = new codepipeline.Pipeline(this, 'Pipeline', {
      pipelineName: 'MyPipeline',
    });

    // Source stage
    const sourceStage = pipeline.addStage({ stageName: 'Source' });
    const sourceOutput = new codepipeline.Artifact('SourceArtifact');

    // DON'T DO THIS IN PRODUCTION - USE SECRET MANAGER COMMENTED BELOW
    const oauthToken = cdk.SecretValue.plainText(process.env.GITHUB_TOKEN);
    // const oauthToken = cdk.SecretValue.secretsManager('GITHUB_TOKEN');

    const sourceAction = new codepipelineActions.GitHubSourceAction({
      actionName: 'GitHub_Source',
      owner: process.env.REPO_OWNER,
      repo: process.env.REPO_NAME,
      branch: process.env.BRANCH,
      oauthToken,
      trigger: codepipelineActions.GitHubTrigger.WEBHOOK,
      output: sourceOutput,
    });
    sourceStage.addAction(sourceAction);

    // Build stage
    const buildStage = pipeline.addStage({ stageName: 'Build' });
    const cdkBuildOuput = new codepipeline.Artifact('CdkArtifact');
    const cdkProject = new codebuild.PipelineProject(this, 'CdkProject', {
      projectName: 'CDK_Project',
      buildSpec: codebuild.BuildSpec.fromObject({
        version: 0.2,
        phases: {
          install: {
            commands: ['cd cdk', 'npm ci'],
          },
          build: {
            commands: ['npm run build', 'npm run cdk synth'],
          },
        },
        artifacts: {
          'base-directory': 'cdk/cdk.out',
          files: ['EcsFargateStack.template.json'],
        },
      }),
      environment: {
        buildImage: codebuild.LinuxBuildImage.STANDARD_2_0,
        environmentVariables: {
          SERVICE_ID: { value: process.env.SERVICE_ID },
        },
      },
    });
    const cdkBuildAction = new codepipelineActions.CodeBuildAction({
      actionName: 'CDK_Build',
      input: sourceOutput,
      project: cdkProject,
      outputs: [cdkBuildOuput],
    });
    buildStage.addAction(cdkBuildAction);

    // Deploy stage
    const deployStage = pipeline.addStage({ stageName: 'Deploy' });
    const role = new iam.Role(this, 'CdkCodeBuildRole', {
      assumedBy: new iam.ServicePrincipal('codebuild.amazonaws.com'),
    });
    role.addToPolicy(
      new iam.PolicyStatement({
        resources: ['*'],
        actions: ['*'],
      })
    );
    const deployProject = new codebuild.PipelineProject(
      this,
      'Deploy_Project',
      {
        buildSpec: codebuild.BuildSpec.fromObject({
          version: 0.2,
          phases: {
            install: {
              commands: ['cd cdk', 'npm install'],
            },
            build: {
              commands: [
                'npm run build',
                'npm run cdk synth',
                'npm run cdk deploy EcsFargateStack -- --require-approval never',
              ],
            },
          },
        }),
        environment: {
          buildImage: codebuild.LinuxBuildImage.STANDARD_2_0,
          environmentVariables: {
            SERVICE_ID: { value: process.env.SERVICE_ID },
          },
          privileged: true, // Enable Docker daemon inside container
        },
        role,
      }
    );
    const deployAction = new codepipelineActions.CodeBuildAction({
      actionName: 'ECS_CFN_Deploy',
      input: sourceOutput,
      project: deployProject,
    });
    deployStage.addAction(deployAction);
  }
}
