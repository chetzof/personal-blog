import chalk from 'chalk'
import { $ } from 'execa'

import type { Context } from '@/bootstrap'
import { toExecaError } from '@/bootstrap/lib/error'

import type { ExecaChildProcess } from 'execa'
import type { ListrTaskWrapper, ListrTaskWrapper } from 'listr2'

type StackNames = 'dns' | 'role' | 'server'
interface StackContext {
  domain: string
  repo: string
}
export function createError(message: string): Error {
  return new Error(chalk.red(message))
}

export function throwError(message: string): void {
  throw new Error(chalk.red(message))
}

interface RunnerOptions {
  verbose?: boolean
}

export async function run<
  P extends ExecaChildProcess,
  T extends ListrTaskWrapper<any, any>,
>(proc: P, task: T, { verbose = true }: RunnerOptions = {}) {
  if (verbose) {
    proc.stdout?.pipe(task.stdout())
    proc.stderr?.pipe(task.stdout())
  }

  try {
    const result = await proc

    if (result.stdout.length > 0 && verbose) {
      task.output = chalk.gray(result.stdout.trim())
    }

    if (result.stderr.length > 0 && verbose) {
      task.output = chalk.gray(result.stderr.trim())
    }

    return result
  } catch (error) {
    const execaError = toExecaError(error)
    task.output = chalk.gray(execaError.stderr.trim())
    throw error
  }
}

export async function runAndParse<
  O,
  P extends ExecaChildProcess = ExecaChildProcess,
  T extends ListrTaskWrapper<any, any> = ListrTaskWrapper<any, any>,
>(proc: P, task: T, options: RunnerOptions = {}): Promise<O> {
  const result = await run(proc, task, options)
  return JSON.parse(result.stdout) as O
}

function getContextArguments(context: StackContext): string[] {
  const cmdArguments: string[] = []

  for (const [contextKey, contextValue] of Object.entries(context)) {
    cmdArguments.push('-c', `${contextKey}=${contextValue as string}`)
  }

  return cmdArguments
}

export async function runStack<T extends ListrTaskWrapper<any, any>>(
  stackName: StackNames,
  stackContext: StackContext,
  task: T,
) {
  await run(
    $`npm run -w infra cdk deploy ${stackName} -- --method direct --require-approval never ${getContextArguments(
      stackContext,
    )}`,
    task,
  )
}
export async function runStackBoostrap<T extends ListrTaskWrapper<any, any>>(
  stackContext: StackContext,
  task: T,
) {
  await run(
    $`npm run -w infra cdk bootstrap -- ${getContextArguments(stackContext)}`,
    task,
  )
}

export async function getStackOutputValue(
  key: string,
  stackName: StackNames,
  task: ListrTaskWrapper<any, any>,
) {
  const output = await runAndParse<{
    Stacks: Array<{
      Outputs: Array<{ OutputKey: string; OutputValue: string }>
    }>
  }>($`aws cloudformation describe-stacks --stack-name ${stackName}`, task, {
    verbose: false,
  })

  const value = output.Stacks[0]?.Outputs.find(
    ({ OutputKey }) => OutputKey === key,
  )?.OutputValue

  if (!value) {
    throw createError(`Output value '${key}' not found`)
  }

  return value
}

export async function setGithubVar({
  varName,
  varValue,
  repo,
  task,
}: {
  varName: string
  varValue: string
  repo: string
  task: ListrTaskWrapper<any, any>
}) {
  await run($`gh variable set ${varName} --body ${varValue} -R ${repo}`, task)
}

export function getTaskContextValue(key: keyof Context, context: Context) {
  if (!context[key]) {
    throw createError(`Key ${key} is not set`)
  }

  return context[key]
}
