import { resolveNs } from 'node:dns/promises'

import chalk from 'chalk'
import { isEqual } from 'lodash-es'

import type { Context } from '@/bootstrap'
import { getStackOutputValue } from '@/bootstrap/lib/util'

import type { ListrTask } from 'listr2'

export const waitDnsMatch: ListrTask<Context> = {
  task: (context, task) =>
    task.newListr([
      {
        title: 'Set the domain nameservers to the following values',
        async task(_context, subtask) {
          const dns = await getStackOutputValue('dns', 'dns', task)
          const expectedNameservers = (JSON.parse(dns) as string[]).sort()

          subtask.output = `Expected  nameservers: \n${chalk.green(
            expectedNameservers.join('\n'),
          )}`

          context.nameservers = expectedNameservers
        },
        options: {
          persistentOutput: true,
        },
      },
      {
        async task(_context, subtask) {
          subtask.title = `Checking current namesrvers for the ${chalk.bold(
            context.domain,
          )}`
          subtask.output = chalk.green('Nameservers are correct, continuing...')
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          let currentNameservers = await resolveNs(context.domain!)
          currentNameservers.sort()
          subtask.output = chalk.green(121)
          while (!isEqual(context.nameservers, currentNameservers)) {
            subtask.output = `Current nameservers:  \n ${chalk.red(
              currentNameservers.join('\n'),
            )}`
            await subtask.prompt({
              type: 'Confirm',
              message:
                'To continue, please make sure that your nameserver are correct. Recheck nameservers?',
            })

            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            currentNameservers = await resolveNs(context.domain!)
            currentNameservers.sort()
            subtask.output = ''
          }
          subtask.output = chalk.green('Nameservers are correct, continuing...')
        },
        options: { persistentOutput: true },
      },
    ]),
}
