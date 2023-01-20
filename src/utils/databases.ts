import { MongoClient, Db, MongoClientOptions } from 'mongodb'
import { URLBuilder } from '@utils/builders/url'
import { environments } from '@utils/environments'

// Build URL for MongoDB client
const url = URLBuilder({
  scheme: environments.MONGODB_SCHEME,
  username: environments.MONGODB_USERNAME,
  password: environments.MONGODB_PASSWORD,
  hostname: environments.MONGODB_HOSTNAME
})

// Configure options for MongoDB client
const options = {
  maxIdleTimeMS: 1000 * 60 * 60
}

/**
 * A class for interfacing with a database management system
 */
class DatabaseManagementSystem {
  /**
   * Declare all private fields
   */
  private readonly url: string
  private readonly client: MongoClient

  /**
   * Constructor for setting up a database management system
   * @param url a URL for the MongoDB client
   * @param options a set of options for the MongoDB client
   */
  constructor (url: string, options: MongoClientOptions) {
    this.url = url
    this.client = new MongoClient(this.url, options)
  }

  /**
   * Sets up a database instance
   * @param name a name for the database instance
   * @returns a database instance
   */
  public databases (name: string): Db {
    return this.client.db(name)
  }

  /**
   * Connects to a database management system
   */
  public async connect (): Promise<void> {
    await this.client.connect()
  }

  /**
   * Disconnects from a database management system
   */
  public async disconnect (): Promise<void> {
    await this.client.close()
  }
}

export default new DatabaseManagementSystem(url, options)
