import { schemaEnvironmentFile } from '@utils/validators'
import chalk from 'chalk'
import { customErrorMap } from './errors'

// Parse environment variables safely intercept the message
const parse = schemaEnvironmentFile.safeParse(process.env, {
  errorMap: customErrorMap
})

// Unsuccessful parse
if (!parse.success) {
  // Format error message
  const errors = parse.error.errors.map((value) => {
    return `\t${chalk.red('✘')} ${chalk.dim(value.message)}`
  })

  // Print error message to console
  console.error(
    'Bad environment configuration! Double check the .env file.' + '\n' +
    errors.join('\n') + '\n'
  )

  // Exit early
  process.exit(1)
}

// Successful parse
export const environments = parse.data
