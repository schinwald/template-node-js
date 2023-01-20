import { z } from 'zod'

// Schema for validating a URL
export const schemaURL = z.string().url()
