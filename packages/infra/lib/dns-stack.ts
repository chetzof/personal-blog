import * as cdk from 'aws-cdk-lib'
import { CfnOutput } from 'aws-cdk-lib'
import { HostedZone } from 'aws-cdk-lib/aws-route53'

import type * as route53 from 'aws-cdk-lib/aws-route53'
import type { Construct } from 'constructs'

export class DnsStack extends cdk.Stack {
  public readonly hostedZone: route53.HostedZone

  constructor(scope: Construct, id: string, properties?: cdk.StackProps) {
    super(scope, id, properties)

    this.hostedZone = new HostedZone(this, 'HostedZone', {
      zoneName: this.node.getContext('domain'),
    })

    new CfnOutput(this, 'dns', {
      value: this.toJsonString(this.hostedZone.hostedZoneNameServers),
    })
  }
}
