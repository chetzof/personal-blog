import chalk from 'chalk'

import type { Context } from '@/bootstrap'
import { getContextVar, saveContextVar } from '@/bootstrap/lib/util'

import type { ListrTask } from 'listr2'

export const inputDomain: ListrTask<Context> = {
  async task(context, task) {
    const savedDomain = await getContextVar('domain')
    if (savedDomain) {
      context.domain = savedDomain
      return
    }

    const question = 'Please enter the domain name'
    context.domain = await task.prompt({
      type: 'Input',
      message: 'Please enter the domain nane',
    })

    await saveContextVar('domain', context.domain)
    task.title = question
    task.output = chalk.gray(context.domain)
  },
  options: {
    persistentOutput: true,
  },
}
