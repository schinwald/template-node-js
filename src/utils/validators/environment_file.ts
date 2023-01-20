import { z } from 'zod'
import { schemaEnvironmentType } from './environment_type'
import { schemaHostname } from './hostname'
import { schemaStringToPort } from './port'
import { schemaStringToBoolean } from './primitives/boolean'
import { schemaString } from './primitives/string'
import { schemaScheme } from './scheme'
import { schemaURL } from './url'

export const schemaEnvironmentFile = z.object({
  FORCE_COLOR: schemaStringToBoolean,
  APP_NAME: schemaString,
  APP_VERSION: schemaString,
  APP_ENVIRONMENT: schemaEnvironmentType,
  APP_SCHEME: schemaScheme,
  APP_HOSTNAME: schemaHostname,
  APP_PORT: schemaStringToPort,
  APP_DOCUMENTATION: schemaURL.optional(),
  MONGODB_SCHEME: schemaScheme,
  MONGODB_USERNAME: schemaString,
  MONGODB_PASSWORD: schemaString,
  MONGODB_HOSTNAME: schemaHostname
})
