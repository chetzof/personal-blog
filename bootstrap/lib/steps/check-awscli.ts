import chalk from 'chalk'
import { $ } from 'execa'

import { run, throwError } from '@/bootstrap/lib/util'

import type { ListrTask } from 'listr2'

export const checkAwscli: ListrTask = {
  async task(_context, task) {
    task.title = `${chalk.bgGreen.bold(' AWS ')}: Checking if ${chalk.green(
      'AWS CLI',
    )} is installed`
    try {
      await run($`aws --version`, task)
    } catch {
      throwError(
        'AWS CLI not found, please install it from https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html and try again',
      )
    }
  },
  options: {
    persistentOutput: true,
  },
}
