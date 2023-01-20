import { z, ZodError, ZodIssue, ZodIssueCode } from 'zod'
import { humanReadableJoin, prefixDeterminer } from '@utils/formatters'
import { InternalAPI, JSON } from '@models/types/network'

/**
 * Add the appropriate prefix to the error message
 * @param paths a list of paths that are causing issues
 * @returns an error message prefix
 */
export function generateValidationErrorPrefix (paths: Array<Array<string | number>>): string {
  // Remove each empty path
  // Join each path array to be human readable with a dot
  const fields = paths.filter((path) => {
    if (path.length === 0) return false
    return true
  }).map((path) => {
    return path.join('.')
  })

  // Display prefix with
  if (fields.length === 0) {
    return 'Invalid input! Field'
  } else if (paths.length === 1) {
    return `Invalid input! Field ${fields[0]}`
  } else {
    return `Invalid input! Fields ${humanReadableJoin('and', fields)}`
  }
}

/**
 * Maps a Zod issue to a corresponding error message
 * @param issue an issue that has been raised
 * @param ctx a context for the error
 * @returns a modified error message
 */
export const customErrorMap: z.ZodErrorMap = (issue, ctx) => {
  let paths: Array<Array<string | number>>

  // Handle path with keys
  // Prepend path to each key
  if ('keys' in issue) {
    paths = []
    // Add keys to path
    for (const key of issue.keys) {
      paths.push([...issue.path, key])
    }
  } else {
    // Only add path to paths if it has items
    paths = issue.path.length > 0 ? [issue.path] : []
  }

  const prefix = generateValidationErrorPrefix(paths)

  // Handle each issue code
  switch (issue.code) {
    // Customize type error message
    case ZodIssueCode.invalid_type:
    // Handle missing field
      if (issue.received === 'undefined') {
        return { message: `${prefix} is missing, expected ${prefixDeterminer('a', issue.expected)}.` }
      // Handle unexpected type
      } else {
        return { message: `${prefix} is expecting ${prefixDeterminer('a', issue.expected)}, but got ${prefixDeterminer('a', issue.received)} instead.` }
      }
    // Customize key error message
    case ZodIssueCode.unrecognized_keys:
      return { message: `${prefix} ${paths.length > 1 ? 'do' : 'does'} not exist and should not be sent.` }
    // Customize union error message
    case ZodIssueCode.invalid_union:
      return { message: `${prefix} ${ctx.defaultError}` }
    // Customize enum error message
    case ZodIssueCode.invalid_enum_value:
      return { message: `${prefix} does not support option ${issue.received}, try ${humanReadableJoin('or', issue.options.map(value => value.toString()))} options instead.` }
    // Customize argument error message
    case ZodIssueCode.invalid_arguments:
      return { message: `${prefix} ${ctx.defaultError}` }
    // Customize return type error message
    case ZodIssueCode.invalid_return_type:
      return { message: `${prefix} ${ctx.defaultError}` }
    // Customize date error message
    case ZodIssueCode.invalid_date:
      return { message: `${prefix} ${ctx.defaultError}` }
    // Customize string error message
    case ZodIssueCode.invalid_string:
      if (typeof issue.validation === 'object') {
        if ('startsWith' in issue.validation) {
          return { message: `${prefix} does not start with ${issue.validation.startsWith}.` }
        } else if ('endsWith' in issue.validation) {
          return { message: `${prefix} does not end with ${issue.validation.endsWith}.` }
        }
      }

      switch (issue.validation) {
        case 'url':
          return { message: `${prefix} is not a valid format for a URL.` }
        case 'email':
          return { message: `${prefix} is not a valid format for an email.` }
        case 'uuid':
          return { message: `${prefix} is not a valid format for a UUID.` }
        case 'regex':
          return { message: `${prefix} is not a valid format for a regular expression.` }
        case 'cuid':
          return { message: `${prefix} is not a valid format for a CUID.` }
        case 'datetime':
          return { message: `${prefix} is not a valid format for a date.` }
      }
      break
    // Customize lower bound error message
    case ZodIssueCode.too_small:
      switch (issue.type) {
        case 'string':
          return { message: `${prefix} is a string that should not have ${issue.inclusive ? `less than ${issue.minimum}` : `${issue.minimum} or less`} characters.` }
        case 'number':
          return { message: `${prefix} is a number that should not be ${issue.inclusive ? `less than ${issue.minimum}` : `less than or equal to ${issue.minimum}`}.` }
        case 'date':
          return { message: `${prefix} is a date that should not be ${issue.inclusive ? `before ${issue.minimum}` : `on ${issue.minimum} or before it`}.` }
        case 'array':
          return { message: `${prefix} is an array that should not have ${issue.inclusive ? `less than ${issue.minimum}` : `${issue.minimum} or less`} elements.` }
        case 'set':
          return { message: `${prefix} is a set that should not have ${issue.inclusive ? `less than ${issue.minimum}` : `${issue.minimum} or less`} elements.` }
      }
      break
    // Customize upper bound error message
    case ZodIssueCode.too_big:
      switch (issue.type) {
        case 'string':
          return { message: `${prefix} is a string that should not have ${issue.inclusive ? `more than ${issue.maximum}` : `${issue.maximum} or more`} characters.` }
        case 'number':
          return { message: `${prefix} is a number that should not be ${issue.inclusive ? `greater than ${issue.maximum}` : `greater than or equal to ${issue.maximum}`}.` }
        case 'date':
          return { message: `${prefix} is a date that should not be ${issue.inclusive ? `after ${issue.maximum}` : `on ${issue.maximum} or after it`}.` }
        case 'array':
          return { message: `${prefix} is an array that should not have ${issue.inclusive ? `more than ${issue.maximum}` : `${issue.maximum} or more`} elements.` }
        case 'set':
          return { message: `${prefix} is a set that should not have ${issue.inclusive ? `more than ${issue.maximum}` : `${issue.maximum} or more`} elements.` }
      }
      break
    // Customize multiple of error message
    case ZodIssueCode.not_multiple_of:
      return { message: `${prefix} ${ctx.defaultError}` }
    // Customize refine error message
    case ZodIssueCode.custom:
      return { message: ctx.defaultError }
    // Customize catch all error message
    default:
      return { message: ctx.defaultError }
  }
}

/**
 * Handles all generic errors that are thrown in the application
 * @param error an error that was raised
 * @param req an internal API request
 * @param res an internal API response
 * @param next an internal API next callback
 */
export function genericErrorHandler (error: unknown, req: InternalAPI.Request, res: InternalAPI.Response, next: InternalAPI.Next): void {
  const ERROR_INTERNAL_SERVER: JSON.Error = {
    id: '26f4623e-e7c4-4b40-804c-ce9a031d13e1',
    status: '500',
    title: 'Internal Server Error',
    code: '500',
    detail: 'Something went wrong! Please try again later.'
  }

  const errors = []

  if (error instanceof ZodError) {
    // Grab field errors from zod error
    const errors = error.issues.map((issue: ZodIssue) => {
      const ERROR_ZOD: JSON.Error = {
        id: '6df529f2-d897-4fc9-87a4-7545ba5267a0',
        status: '422',
        title: 'Unprocessable Entity',
        code: '422',
        detail: issue.message
      }
      return ERROR_ZOD
    })

    const meta = { status: '400' }
    res.status(parseInt(meta.status)).send({ meta, errors })
    return
  }

  // TODO: add Sentry here
  console.error(error)

  const meta = { status: '400' }
  errors.push(ERROR_INTERNAL_SERVER)
  res.status(parseInt(meta.status)).send({ meta, errors })
}
