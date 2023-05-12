import { Construct } from 'constructs'
import * as iam from 'aws-cdk-lib/aws-iam'
export class GithubRoleConstruct extends Construct {
  constructor(scope: Construct, id: string, props = {}) {
    super(scope, id)
    const provider = new iam.OpenIdConnectProvider(this, 'GithubProvider', {
      url: 'https://token.actions.githubusercontent.com',
      clientIds: ['sts.amazonaws.com'],
      thumbprints: ['6938fd4d98bab03faadb97b34396831e3780aea1'],
    })

    const githubRole = new iam.Role(this, 'GithubRole', {
      roleName: 'GithubRole',
      assumedBy: new iam.FederatedPrincipal(
        provider.openIdConnectProviderArn,
        {
          StringEquals: {
            'token.actions.githubusercontent.com:aud': 'sts.amazonaws.com',
          },
          StringLike: {
            'token.actions.githubusercontent.com:sub':
              'repo:chetzof/personal-blog:*',
          },
        },
        'sts:AssumeRoleWithWebIdentity',
      ),
      managedPolicies: [
        iam.ManagedPolicy.fromAwsManagedPolicyName('AmazonS3FullAccess'),
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
  }
}
