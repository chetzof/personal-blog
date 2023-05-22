import chalk from 'chalk'
import { $ } from 'execa'

import type { Context } from '@/bootstrap'
import { run, throwError } from '@/bootstrap/lib/util'

import type { ListrTask } from 'listr2'

export const checkGhcli: ListrTask<Context> = {
  async task(_context, task) {
    task.title = `${chalk.bgGreen.bold(' GITHUB ')}: Checking if ${chalk.green(
      'GitHub CLI',
    )} is installed`

    try {
      await run($`gh version`, task)
    } catch {
      throwError(
        'GitHub CLI not found, please install it from https://cli.github.com and try again',
      )
    }
  },
  options: {
    persistentOutput: true,
  },
}
