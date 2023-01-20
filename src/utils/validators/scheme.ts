import { z } from 'zod'

// Schema for validating a URL scheme
export const schemaScheme = z.enum(['http', 'https', 'mongodb+srv'])
