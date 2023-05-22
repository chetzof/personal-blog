import chalk from 'chalk'

import type { Context } from '@/bootstrap'

import type { ListrTask } from 'listr2'

export const inputDomain: ListrTask<Context> = {
  async task(context, task) {
    const question = 'Please enter the domain name'
    context.domain = await task.prompt({
      type: 'Input',
      message: 'Please enter the domain nane',
      initial: 'vladcos.com',
    })
    task.title = question
    task.output = chalk.gray(context.domain)
  },
  options: {
    persistentOutput: true,
  },
}
