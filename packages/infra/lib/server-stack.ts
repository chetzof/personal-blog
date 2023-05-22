import * as cdk from 'aws-cdk-lib'
import { CfnOutput, Stack } from 'aws-cdk-lib'
import * as acm from 'aws-cdk-lib/aws-certificatemanager'
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront'
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins'
import * as route53 from 'aws-cdk-lib/aws-route53'
import * as targets from 'aws-cdk-lib/aws-route53-targets'
import * as s3 from 'aws-cdk-lib/aws-s3'

import type * as iam from 'aws-cdk-lib/aws-iam'
import type { Construct } from 'constructs'

interface ConsumerProperties extends cdk.StackProps {
  hostedZone: route53.HostedZone
  role: iam.Role
}

export class ServerStack extends cdk.Stack {
  constructor(scope: Construct, id: string, properties: ConsumerProperties) {
    super(scope, id, properties)
    const certificate = new acm.Certificate(this, 'Certificate', {
      domainName: this.node.getContext('domain'),
      validation: acm.CertificateValidation.fromDns(properties.hostedZone),
    })
    const bucket = new s3.Bucket(this, 'html-bucket', {
      bucketName: this.node.getContext('domain'),
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
      websiteIndexDocument: 'index.html',
      publicReadAccess: true,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ACLS,
    })

    const distribution = new cloudfront.Distribution(
      this,
      'personal-website-distribution',
      {
        defaultBehavior: {
          cachePolicy: new cloudfront.CachePolicy(this, 'cachePolicy', {
            enableAcceptEncodingBrotli: true,
            enableAcceptEncodingGzip: true,
          }),
          origin: new origins.S3Origin(bucket),
          viewerProtocolPolicy:
            cloudfront.ViewerProtocolPolicy.REDIRECT_TO_HTTPS,
        },
        certificate,
        domainNames: [this.node.getContext('domain')],
      },
    )

    new route53.ARecord(this, 'Cloudfront', {
      zone: properties.hostedZone,
      target: route53.RecordTarget.fromAlias(
        new targets.CloudFrontTarget(distribution),
      ),
    })

    new CfnOutput(this, 'distributionId', {
      value: distribution.distributionId,
    })

    new CfnOutput(this, 'awsBucketId', {
      value: bucket.bucketName,
    })
    new CfnOutput(this, 'regionId', {
      value: Stack.of(this).region,
    })
  }
}
