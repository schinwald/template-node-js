import { environmentFileSchema } from '@utils/validators/environments'

export const environments = environmentFileSchema.parse(process.env)
