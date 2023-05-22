import chalk from 'chalk'
import { $ } from 'execa'

import { run, throwError } from '@/bootstrap/lib/util'

import type { ListrTask } from 'listr2'

export const checkAwscliAuth: ListrTask = {
  async task(_context, task) {
    task.title = `${chalk.bgGreen.bold(' AWS ')}: Checking if ${chalk.green(
      'AWS CLI',
    )} is authentificated`

    try {
      await run($`aws iam get-user --output text`, task)
    } catch {
      throwError(
        'AWS CLI not authentificated, please follow this guide https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-authentication.html and try again',
      )
    }
  },
  options: {
    persistentOutput: true,
  },
}
