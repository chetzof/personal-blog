import chalk from 'chalk'

import type { Context } from '@/bootstrap'
import {
  createError,
  getStackOutputValue,
  setGithubVar,
} from '@/bootstrap/lib/util'

import type { ListrTask } from 'listr2'

export const savingRoleToGithub: ListrTask<Context> = {
  async task({ repo }, task) {
    task.title = `${chalk.bgGreen.bold(
      ' GITHUB ',
    )}: Saving the ARN of the role to GITHUB repository variable`

    if (!repo) {
      throw createError('Repo not set')
    }

    const arn = await getStackOutputValue('roleArn', 'role', task)
    await setGithubVar({ varName: 'AWS_ROLE', varValue: arn, repo, task })
  },
  options: {
    persistentOutput: true,
  },
}
