import { z } from 'zod'

// Schema for validating an environment type
export const schemaEnvironmentType = z.enum(['development', 'staging', 'sandbox', 'production'])
