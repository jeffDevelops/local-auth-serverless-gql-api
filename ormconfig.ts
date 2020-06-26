import { ConnectionOptions } from 'typeorm'

const config: ConnectionOptions[] = [
  {
    name: 'default',
    type: 'postgres',
    host: process.env.DATABASE_HOST,
    port: Number(process.env.DATABASE_PORT),
    username: process.env.DATABASE_USERNAME,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    synchronize: true,
    logging: true,
    entities: ['src/entity/*.*'],
    migrations: ['dist/migrations/*.js'],
    cli: {
      migrationsDir: 'dist/migrations',
    },
  },
]

module.exports = config
