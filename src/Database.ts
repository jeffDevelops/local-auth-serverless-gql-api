import {
  ConnectionManager,
  Connection,
  ConnectionOptions,
  getConnectionManager,
  createConnection,
} from 'typeorm'

export class Database {
  private connectionManager: ConnectionManager

  private readonly options: ConnectionOptions = {
    name: 'default',
    type: 'postgres',
    uuidExtension: 'uuid-ossp',
    host: process.env.DATABASE_HOST,
    port: Number(process.env.DATABASE_PORT),
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    entities: [__dirname + '/entity/**/*.*'],
    dropSchema: false,
    synchronize: true,
    logging: false,
  }

  constructor() {
    this.connectionManager = getConnectionManager()
  }

  private connect = async (): Promise<Connection> => {
    return await createConnection(this.options)
  }

  public async getConnection() {
    try {
      const connection = this.connectionManager.get('default')
      return connection.isConnected ? connection : this.connect()
    } catch (e) {
      return this.connect()
    }
  }
}
