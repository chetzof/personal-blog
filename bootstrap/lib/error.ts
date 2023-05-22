import type { ExecaError } from 'execa'

interface ErrorWithMessage {
  message: string
}

function isErrorWithMessage(error: unknown): error is ErrorWithMessage {
  return (
    typeof error === 'object' &&
    error !== null &&
    'message' in error &&
    typeof (error as Record<string, unknown>)['message'] === 'string'
  )
}

export function toExecaError(error: unknown): ExecaError {
  if (isErrorWithMessage(error)) {
    return error as unknown as ExecaError
  }

  throw error
}

export function toErrorWithMessage(maybeError: unknown): ErrorWithMessage {
  if (isErrorWithMessage(maybeError)) return maybeError

  try {
    return new Error(JSON.stringify(maybeError))
  } catch {
    // fallback in case there's an error stringifying the maybeError
    // like with circular references for example.
    return new Error(String(maybeError))
  }
}

// eslint-disable-next-line import/no-unused-modules
export function getErrorMessage(error: unknown): string {
  return toErrorWithMessage(error).message
}
