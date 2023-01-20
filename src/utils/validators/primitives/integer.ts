import { generateValidationErrorPrefix } from '@utils/errors'
import { z } from 'zod'

// Check if string can be turned into a number
const isConvertableToNumber = (arg: any, ctx: z.RefinementCtx): void => {
  if (isNaN(Number(arg))) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: generateValidationErrorPrefix([ctx.path]) + ' cannot be coerced into being an integer.',
      fatal: true
    })
  }
}

// Check if number is an integer
const isInteger = (arg: any, ctx: z.RefinementCtx): void => {
  if (arg % 1 !== 0) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: generateValidationErrorPrefix([ctx.path]) + ' cannot be coerced into being an integer.',
      fatal: true
    })
  }
}

// Schema for validating an integer
export const schemaInteger = z.number().int()

// Schema for validating a string and converting it to an integer
export const schemaStringToInteger = z
  .string()
  .superRefine(isConvertableToNumber)
  .transform((arg) => Number(arg))
  .superRefine(isInteger)
