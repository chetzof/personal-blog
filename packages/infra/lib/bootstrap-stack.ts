import * as cdk from 'aws-cdk-lib'
import { Construct } from 'constructs'
import { GithubRoleConstruct } from './constructs/github-role-construct'

export class BootstrapStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props)
    new GithubRoleConstruct(this, 'github-role')
  }
}
