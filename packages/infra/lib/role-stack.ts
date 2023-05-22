import * as cdk from 'aws-cdk-lib'
import { CfnOutput } from 'aws-cdk-lib'
import * as iam from 'aws-cdk-lib/aws-iam'

import type { Construct } from 'constructs'

export class RoleStack extends cdk.Stack {
  public readonly role: iam.Role
  constructor(scope: Construct, id: string, properties?: cdk.StackProps) {
    super(scope, id, properties)
    const provider = new iam.OpenIdConnectProvider(this, 'GithubProvider', {
      url: 'https://token.actions.githubusercontent.com',
      clientIds: ['sts.amazonaws.com'],
      thumbprints: ['6938fd4d98bab03faadb97b34396831e3780aea1'],
    })

    this.role = new iam.Role(this, 'GithubRole', {
      assumedBy: new iam.FederatedPrincipal(
        provider.openIdConnectProviderArn,
        {
          StringEquals: {
            'token.actions.githubusercontent.com:aud': 'sts.amazonaws.com',
          },
          StringLike: {
            'token.actions.githubusercontent.com:sub': `repo:${this.node.getContext(
              'repo',
            )}:*`,
          },
        },
        'sts:AssumeRoleWithWebIdentity',
      ),
      managedPolicies: [
        iam.ManagedPolicy.fromAwsManagedPolicyName('AmazonS3FullAccess'),
        iam.ManagedPolicy.fromAwsManagedPolicyName('CloudFrontFullAccess'),
        iam.ManagedPolicy.fromAwsManagedPolicyName(
          'AWSCloudFormationReadOnlyAccess',
        ),
      ],
      inlinePolicies: {
        AssumeRole: new iam.PolicyDocument({
          statements: [
            new iam.PolicyStatement({
              resources: ['arn:aws:iam::799200882264:role/cdk-hnb659fds*'],
              actions: ['sts:AssumeRole'],
            }),
          ],
        }),
      },
    })

    new CfnOutput(this, 'roleArn', {
      value: this.role.roleArn,
    })
  }
}
