#!/usr/bin/env node
import 'source-map-support/register'
import * as cdk from 'aws-cdk-lib'
import { BootstrapStack } from '../lib/bootstrap-stack'
import { CiStack } from '../lib/ci-stack'
const app = new cdk.App()
new BootstrapStack(app, 'bootstrap')
new CiStack(app, 'ci')
