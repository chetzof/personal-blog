#!/usr/bin/env node
import 'source-map-support/register'
import * as cdk from 'aws-cdk-lib'
import { DefaultStack } from '../lib/default-stack'
const app = new cdk.App()
new DefaultStack(app, 'default-stack')
