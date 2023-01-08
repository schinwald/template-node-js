import { z } from 'zod'

const stringSchema = z.string()
// const booleanSchema = z.enum(['true', 'false']).transform((arg, ctx) => { return Boolean(arg) })
// const numberSchema = z.string().transform((arg, ctx) => { return parseInt(arg) })

const environmentSchema = z.enum(['development', 'staging', 'sandbox', 'production'])
const schemeSchema = z.enum(['http', 'https', 'mongodb+srv'])
const hostnameSchema = z.string().min(1)
const portSchema = z.string().refine((arg) => { const port = parseInt(arg); return port >= 0 && port <= 65536 }).transform((arg, ctx) => { return parseInt(arg) })

export const environmentFileSchema = z.object({
  APP_NAME: stringSchema,
  APP_VERSION: stringSchema,
  APP_ENVIRONMENT: environmentSchema,
  APP_SCHEME: schemeSchema,
  APP_HOSTNAME: hostnameSchema,
  APP_PORT: portSchema,
  MONGODB_SCHEME: schemeSchema,
  MONGODB_USERNAME: stringSchema,
  MONGODB_PASSWORD: stringSchema,
  MONGODB_HOSTNAME: hostnameSchema
})
