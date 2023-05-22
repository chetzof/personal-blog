import chalk from 'chalk'
import { Listr } from 'listr2'

import { success } from '@/bootstrap/lib/steps/success'

// eslint-disable-next-line no-console
console.log(chalk.cyan.bold('\n Welcome to the bootstrap wizard! \n'))

export interface Context {
  repo?: string
  domain?: string
  nameservers?: string[]
}

await new Listr<Context>([success], {
  rendererOptions: {
    collapseErrors: false,
  },
}).run({})

console.log(
  chalk.green.bold(
    '\n🎉🎉🎉 Congratulations! Your deployment had finished sucessfully! 🎉🎉🎉\n',
  ),
)
