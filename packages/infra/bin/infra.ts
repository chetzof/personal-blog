#!/usr/bin/env node
import 'source-map-support/register'
import * as cdk from 'aws-cdk-lib'
import { RoleStack } from '../lib/role-stack'
import { ServerStack } from '../lib/server-stack'
import { DnsStack } from '../lib/dns-stack'
const app = new cdk.App()
const { role } = new RoleStack(app, 'role')
const { hostedZone } = new DnsStack(app, 'dns')
new ServerStack(app, 'server', { hostedZone, role })
