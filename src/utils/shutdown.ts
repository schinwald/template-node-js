import databases from './databases'

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
