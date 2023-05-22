import chalk from 'chalk'
import { Listr } from 'listr2'

import { checkAwscli } from '@/bootstrap/lib/steps/check-awscli'
import { checkAwscliAuth } from '@/bootstrap/lib/steps/check-awscli-auth'
import { checkGhcli } from '@/bootstrap/lib/steps/check-ghcli'
import { checkGhcliAuth } from '@/bootstrap/lib/steps/check-ghcli-auth'
import { inputDomain } from '@/bootstrap/lib/steps/input-domain'
import { inputRepo } from '@/bootstrap/lib/steps/input-repo'
import { runCdkBootstrap } from '@/bootstrap/lib/steps/run-cdk-bootstrap'
import { runCdkDomainStack } from '@/bootstrap/lib/steps/run-cdk-domain-stack'
import { runCdkRoleStack } from '@/bootstrap/lib/steps/run-cdk-role-stack'
import { runCdkServerStack } from '@/bootstrap/lib/steps/run-cdk-server-stack'
import { savingRoleToGithub } from '@/bootstrap/lib/steps/saving-role-to-github'
import { waitDnsMatch } from '@/bootstrap/lib/steps/wait-dns-match'

// eslint-disable-next-line no-console
console.log(chalk.cyan.bold('\n Welcome to the bootstrap wizard! \n'))
export interface Context {
  repo?: string
  domain?: string
  nameservers?: string[]
}

await new Listr<Context>(
  [
    checkGhcli,
    checkGhcliAuth,
    checkAwscli,
    checkAwscliAuth,
    inputDomain,
    inputRepo,
    runCdkBootstrap,
    runCdkRoleStack,
    savingRoleToGithub,
    runCdkDomainStack,
    waitDnsMatch,
    runCdkServerStack,
  ],
  {
    rendererOptions: {
      collapseErrors: false,
    },
  },
).run({})

console.log(
  chalk.green.bold(
    '\n🎉🎉🎉 Congratulations! Your deployment had finished sucessfully! 🎉🎉🎉\n',
  ),
)
