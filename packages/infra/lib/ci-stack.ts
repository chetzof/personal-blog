import * as cdk from 'aws-cdk-lib'
import { Construct } from 'constructs'
import * as cloudfront from 'aws-cdk-lib/aws-cloudfront'
import * as origins from 'aws-cdk-lib/aws-cloudfront-origins'
import * as s3 from 'aws-cdk-lib/aws-s3'
export class CiStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props)
    const bucket = new s3.Bucket(this, 'html-bucket', {
      bucketName: 'chetzof-html-bucket',
      removalPolicy: cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: true,
      websiteIndexDocument: 'index.html',
      publicReadAccess: true,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ACLS,
      accessControl: s3.BucketAccessControl.BUCKET_OWNER_FULL_CONTROL,
    })
    // new cloudfront.Distribution(this, 'personal-website-distribution', {
    //   defaultBehavior: { origin: new origins.S3Origin(bucket) },
    // })
  }
}
