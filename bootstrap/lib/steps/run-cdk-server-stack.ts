import chalk from 'chalk'

import type { Context } from '@/bootstrap'
import {
  createError,
  getStackOutputValue,
  getTaskContextValue,
  runStack,
  setGithubVar,
} from '@/bootstrap/lib/util'

import type { ListrTask } from 'listr2'

export const runCdkServerStack: ListrTask<Context> = {
  async task(context, task) {
    const repo = getTaskContextValue('repo', context)
    const domain = getTaskContextValue('domain', context)
    task.title = `${chalk.bgGreen.bold(' AWS ')}: Running  ${chalk.green(
      'AWS CDK',
    )} server stack. ${chalk.red(
      'Please be patient, this may take some time!',
    )}`

    if (!domain) {
      throw createError('Domain not set')
    }

    if (!repo) {
      throw createError('Repo not set')
    }

    await runStack('server', { domain, repo }, task)

    await setGithubVar({
      varName: 'AWS_DISTRIBUTION',
      varValue: await getStackOutputValue('distributionId', 'server', task),
      repo,
      task,
    })

    await setGithubVar({
      varName: 'AWS_BUCKET',
      varValue: await getStackOutputValue('awsBucketId', 'server', task),
      repo,
      task,
    })

    await setGithubVar({
      varName: 'AWS_REGION',
      varValue: await getStackOutputValue('regionId', 'server', task),
      repo,
      task,
    })
  },
  options: {
    persistentOutput: false,
  },
}
