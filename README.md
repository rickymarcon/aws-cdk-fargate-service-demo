# [Demo] Creating a CI/CD pipeline for an AWS Fargate service using the AWS CDK

This demo uses the AWS CDK to achieve the following:

- Dockerize `my-service` (a simple express server), and push it to **Amazon ECR**
- Create a **VPC** with 2 AZs (Availability Zones)
- Create an **AWS Fargate** service using the Dockerized image from AWS ECR
- Deploy service to an **Amazon ECS** cluster with 2 running tasks
- Expose service with an internet-facing **Application Load Balancer**
- Build a **CI/CD pipeline** to automate the entire process (using this GitHub repository as the source)

## Get started

Install the CDK and dependencies first.

```bash
# Install the AWS CDK
npm install -g aws-cdk

# Install the dependencies for the cdk app
cd cdk
npm install

# Rename .env.sample and add your environment variables
mv .env.sample .env
```

Note: A [GitHub personal access token](<(https://help.github.com/en/github/authenticating-to-github/creating-a-personal-access-token-for-the-command-line)>) is needed for the CI server to pull from your repo.

## Build

To build the app, you need to be in this demos's `cdk` folder. Then run the following:

```bash
npm run build

# Generate CloudFormation templates
cdk synth
```

## Deploy

```bash
cdk deploy EcsPipelineStack
```

This will deploy just the `EcsPipelineStack` - which will then trigger the CI/CD pipeline to build the `EcsClusterStack` and deploy it to AWS.

## Clean up

To avoid unexpected AWS charges, destroy your AWS CDK stacks after you're done with this demo.

```bash
cdk destroy "*"
```

## CDK Toolkit

The [`cdk.json`](./cdk.json) file in the root of this repository includes
instructions for the CDK toolkit on how to execute this program.

After building your TypeScript code, you will be able to run the CDK toolkits commands as usual:

    $ cdk ls
    <list all stacks in this program>

    $ cdk synth
    <generates and outputs cloudformation template>

    $ cdk deploy
    <deploys stack to your account>

    $ cdk diff
    <shows diff against deployed stack>
