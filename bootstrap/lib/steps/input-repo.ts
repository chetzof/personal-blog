import { $ } from 'execa'

import type { Context } from '@/bootstrap'
import { runAndParse } from '@/bootstrap/lib/util'

import type { ListrTask } from 'listr2'

export const inputRepo: ListrTask<Context> = {
  async task(context, task) {
    const repos = await runAndParse<Array<{ nameWithOwner: string }>>(
      $`gh repo list --json nameWithOwner`,
      task,
      { verbose: false },
    )
    const list = repos.map((item) => item.nameWithOwner)
    context.repo = await task.prompt({
      type: 'AutoComplete',
      message: 'Start typing the name of your github repo...',
      choices: list,
    })
  },
  options: {
    persistentOutput: true,
  },
}
