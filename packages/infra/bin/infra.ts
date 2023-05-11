#!/usr/bin/env node
import 'source-map-support/register'
import * as cdk from 'aws-cdk-lib'
import { BucketStack } from '../lib/bucket-stack'
import { ProviderStack } from '../lib/provider-stack'
const app = new cdk.App()
new BucketStack(app, 'bucket-stack')
new ProviderStack(app, 'provider-stack')
