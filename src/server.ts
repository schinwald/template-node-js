import '@utils/shutdown'
import 'express-async-errors'
import { environments } from '@utils/environments'
import express from 'express'
import createRouter from 'express-file-routing'
import databases from '@utils/databases'
import assets from '@assets'
import { z } from 'zod'
import { customErrorMap, genericErrorHandler } from '@utils/errors'
import { URLBuilder } from '@utils/builders/url'
import chalk from 'chalk'

/**
* Entry point for starting up the node server
*/
async function main (): Promise<void> {
  console.info(chalk.bold(`Starting the ${environments.APP_NAME} server`))
  console.info('')

  // Starting the server
  const app = express()

  // Setup database connections
  console.info(`\t${chalk.bold.green('✓')} Setting up database management system`)
  await databases.connect()

  // Load assets
  console.info(`\t${chalk.bold.green('✓')} Setting up assets`)
  assets.load()

  // Setup middleware that runs before routes
  console.info(`\t${chalk.bold.green('✓')} Setting up middleware`)
  app.use(express.json())
  app.use(express.urlencoded({ extended: false }))

  // Automatically registers routes using the folder structure in the routes directory
  console.info(`\t${chalk.bold.green('✓')} Setting up routes based on folder structure`)
  createRouter(app)

  // Setup error handler middleware
  console.info(`\t${chalk.bold.green('✓')} Setting up error handlers`)
  z.setErrorMap(customErrorMap)
  app.use(genericErrorHandler)

  // Start the server on http://localhost:3000
  // Map the domain to the correct one in docker and nginx
  app.listen(3000, () => {
    // Where the server is actually running outside of the docker container
    const url = URLBuilder({
      scheme: environments.APP_SCHEME,
      hostname: environments.APP_HOSTNAME,
      port: environments.APP_PORT
    })

    // Display server information
    console.info('')
    console.info(chalk.bold(`Done! Server is running at: 💻 ${chalk.blue(url)}`))

    // Display documentation if it is provided
    if (environments.APP_DOCUMENTATION !== undefined) {
      console.info(chalk.bold(`See documentation for usage: 📚 ${chalk.blue(environments.APP_DOCUMENTATION)}`))
    }

    console.info('')
  })
}

void main()
