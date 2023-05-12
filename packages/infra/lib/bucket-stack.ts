import * as cdk from 'aws-cdk-lib'
import { Construct } from 'constructs'
import * as s3 from 'aws-cdk-lib/aws-s3'

export class BucketConstruct extends Construct {
  constructor(scope: Construct, id: string, props = {}) {
    super(scope, id)

    new s3.Bucket(this, 'HtmlBucket', {
      bucketName: 'chetzof-html-bucket',
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
    })
  }
}
