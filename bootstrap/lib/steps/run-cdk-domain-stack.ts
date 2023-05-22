import chalk from 'chalk'

import type { Context } from '@/bootstrap'
import {
  createError,
  getTaskContextValue,
  runStack,
} from '@/bootstrap/lib/util'

import type { ListrTask } from 'listr2'

export const runCdkDomainStack: ListrTask<Context> = {
  async task(context, task) {
    const repo = getTaskContextValue('repo', context)
    const domain = getTaskContextValue('domain', context)
    task.title = `${chalk.bgGreen.bold(' AWS ')}: Running  ${chalk.green(
      'AWS CDK',
    )} domain stack`

    if (!domain) {
      throw createError('Domain not set')
    }

    await runStack('dns', { repo, domain }, task)
  },
  options: {
    persistentOutput: false,
  },
}
