import 'express-async-errors'
import express from 'express'
import createRouter from 'express-file-routing'
import databases from '@utils/databases'
import assets from '@assets'
import { z } from 'zod'
import { customErrorMap, genericErrorHandler } from '@utils/errors'
import { URLBuilder } from '@utils/builders/url'
import { environments } from '@utils/environments'

// Handler for gracefully exitting
async function exitHandler (): Promise<void> {
  console.log('Closing down the server...')

  console.log('Clearing all resources...')
  await databases.disconnect()

  console.log('Done!')
  console.log('Shutting down.')
}

// Handle shutdown when process.exit occurs
process.on('exit', () => {
  void exitHandler()
})

// Handle shutdown when interrupt signal occurs
process.on('SIGINT', () => {
  process.exit(1)
})

// Handle shutdown when terminate signal occurs
process.on('SIGTERM', () => {
  process.exit(1)
})

// Handle shutdown when user defined signal occurs (nodemon)
process.on('SIGUSR2', () => {
  process.exit(1)
})

// Handle shutdown when an uncaught exception occurs
process.on('uncaughtException', (exception) => {
  // TODO: add sentry alert here
  console.error(exception.stack)
  process.exit(1)
})

async function main (): Promise<void> {
  // Starting the server
  console.log('Starting server please wait...')

  // Validate environment variables
  console.log('Validating environment variables...')

  const app = express()

  // Setup database connections
  console.log('Setting up database management system connections...')
  await databases.connect()

  // Load assets
  console.log('Loading assets...')
  assets.load()

  // Setup middleware that runs before routes
  console.log('Setting up middleware...')
  app.use(express.json())
  app.use(express.urlencoded({ extended: false }))

  // Automatically registers routes using the folder structure in the routes directory
  console.log('Automatically registering routes based on file structure...')
  createRouter(app)

  // Setup error handler middleware
  console.log('Setting up error handlers...')
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

    console.log('Done!')
    console.log(`Server running at ${url}`)
  })
}

void main()
