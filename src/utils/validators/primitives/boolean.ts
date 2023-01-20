import { z } from 'zod'

// Schema for validating a boolean
export const schemaBoolean = z.boolean()

// Schema for validating a string and converting it to a boolean
export const schemaStringToBoolean = z
  .enum(['true', 'false'])
  .transform((arg) => arg === 'true')
