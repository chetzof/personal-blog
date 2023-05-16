import * as cdk from 'aws-cdk-lib'
import { Construct } from 'constructs'
import * as route53 from 'aws-cdk-lib/aws-route53'
import { HostedZone } from 'aws-cdk-lib/aws-route53'
export class DnsStack extends cdk.Stack {
  public readonly hostedZone: route53.HostedZone

  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props)

    this.hostedZone = new HostedZone(this, 'HostedZone', {
      zoneName: this.node.getContext('domain'),
    })
  }
}
