import chalk from 'chalk'

import type { Context } from '@/bootstrap'
import { getTaskContextValue, runStackBoostrap } from '@/bootstrap/lib/util'

import type { ListrTask } from 'listr2'

export const runCdkBootstrap: ListrTask<Context> = {
  async task(context, task) {
    const repo = getTaskContextValue('repo', context)
    const domain = getTaskContextValue('domain', context)
    task.title = `${chalk.bgGreen.bold(' AWS ')}: Running  ${chalk.green(
      'AWS CDK',
    )} bootstrap`
    await runStackBoostrap({ repo, domain }, task)
  },
  options: {
    persistentOutput: true,
  },
}
