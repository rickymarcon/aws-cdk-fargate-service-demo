import * as cdk from '@aws-cdk/core';
import * as codepipeline from '@aws-cdk/aws-codepipeline';
import * as codebuild from '@aws-cdk/aws-codebuild';
import * as codepipelineActions from '@aws-cdk/aws-codepipeline-actions';

interface EcsPipelineStackProps extends cdk.StackProps {}

export class EcsPipelineStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props: EcsPipelineStackProps) {
    super(scope, id, props);

    const pipeline = new codepipeline.Pipeline(this, 'Pipeline');

    // Source stage
    const sourceStage = pipeline.addStage({ stageName: 'Source' });
    const sourceOutput = new codepipeline.Artifact('SourceArtifact');

    // DON'T DO THIS IN PRODUCTION - USE SECRET MANAGER COMMENTED BELOW
    const oauthToken = cdk.SecretValue.plainText(
      String(process.env.GITHUB_TOKEN)
    );
    // const oauthToken = cdk.SecretValue.secretsManager('GITHUB_TOKEN');

    const sourceAction = new codepipelineActions.GitHubSourceAction({
      actionName: 'GitHub_Source',
      owner: 'rickymarcon',
      repo: 'aws-cdk-ecs-cluster',
      branch: 'master', // default
      oauthToken,
      trigger: codepipelineActions.GitHubTrigger.POLL,
      output: sourceOutput,
    });
    sourceStage.addAction(sourceAction);

    // Build stage
    const buildStage = pipeline.addStage({ stageName: 'Build' });

    // Step 1: Build CDK
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
            commands: ['npm run build', 'npx cdk synth'],
          },
        },
        artifacts: {
          'base-directory': 'cdk.out',
          files: ['EcsClusterStack.template.json'],
        },
      }),
      environment: {
        buildImage: codebuild.LinuxBuildImage.STANDARD_2_0,
      },
    });
    const cdkBuildAction = new codepipelineActions.CodeBuildAction({
      actionName: 'CDK_Build',
      input: sourceOutput,
      project: cdkProject,
      outputs: [cdkBuildOuput],
    });
    buildStage.addAction(cdkBuildAction);

    // Step 2: Build Microservice
    const serviceProject = new codebuild.PipelineProject(
      this,
      'ServiceProject',
      {
        projectName: 'Service_Project',
        buildSpec: codebuild.BuildSpec.fromObject({
          version: 0.2,
          phases: {
            install: {
              commands: ['cd service', 'npm ci'],
            },
            build: {
              commands: ['npm run build'],
            },
            artifacts: {
              files: ['dist/**/*, node-modules/**/*'],
            },
          },
        }),
        environment: {
          buildImage: codebuild.LinuxBuildImage.STANDARD_2_0,
        },
      }
    );
    const serviceBuildAction = new codepipelineActions.CodeBuildAction({
      actionName: 'Service_Build',
      input: sourceOutput,
      project: serviceProject,
    });
    buildStage.addAction(serviceBuildAction);

    // Deploy stage
    const deployStage = pipeline.addStage({ stageName: 'Deploy' });
    const deployAction = new codepipelineActions.CloudFormationCreateUpdateStackAction(
      {
        actionName: 'ECS_CFN_Deploy',
        templatePath: cdkBuildOuput.atPath('EcsClusterStack.template.json'),
        stackName: 'EcsClusterDeploymentStack',
        adminPermissions: true,
      }
    );
    deployStage.addAction(deployAction);
  }
}
