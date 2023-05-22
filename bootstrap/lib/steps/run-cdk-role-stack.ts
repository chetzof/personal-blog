import chalk from 'chalk'

import type { Context } from '@/bootstrap'
import { getTaskContextValue, runStack } from '@/bootstrap/lib/util'

import type { ListrTask } from 'listr2'

export const runCdkRoleStack: ListrTask<Context> = {
  async task(context, task) {
    const repo = getTaskContextValue('repo', context)
    const domain = getTaskContextValue('domain', context)
    task.title = `${chalk.bgGreen.bold(' AWS ')}: Running  ${chalk.green(
      'AWS CDK',
    )} role stack`

    await runStack('role', { repo, domain }, task)
  },
  options: {
    persistentOutput: false,
  },
}
