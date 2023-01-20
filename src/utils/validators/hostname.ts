import { z } from 'zod'

// Schema for validating a URL host name
export const schemaHostname = z.string().min(1)
