import { generateValidationErrorPrefix } from '@utils/errors'
import { z } from 'zod'
import { schemaStringToInteger } from './primitives/integer'

// Check if number is in the port range
const isInRange = (arg: number, ctx: z.RefinementCtx): void => {
  if (arg < 0 || arg > 65536) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: generateValidationErrorPrefix([ctx.path]) + ' must be a port number between 0 and 63633 inclusive.',
      fatal: true
    })
  }
}

// Schema for validating a port number
export const schemaPort = z
  .number()
  .int()
  .superRefine(isInRange)

// Schema for validating a string and converting it to a port number
export const schemaStringToPort = schemaStringToInteger
  .superRefine(isInRange)
