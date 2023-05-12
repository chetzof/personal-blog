import * as cdk from 'aws-cdk-lib'
import { Construct } from 'constructs'
import { GithubRoleConstruct } from './github-role-construct'
import { BucketConstruct } from './bucket-stack'

export class DefaultStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props)
    new GithubRoleConstruct(this, id)
    new BucketConstruct(this, id)
  }
}
