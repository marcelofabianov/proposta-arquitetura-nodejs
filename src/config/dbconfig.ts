import { ClientConfig, PoolConfig } from '@/services/database/config'
import { env } from './env'

const dbConfig: ClientConfig = {
  host: env.DB_HOST,
  port: env.DB_PORT,
  user: env.DB_USER,
  password: env.DB_PASSWORD,
  database: env.DB_DATABASE,
  ssl: env.DB_SSL,
  connectionTimeoutMillis: env.DB_TIMEOUT,
  idle_in_transaction_session_timeout: env.DB_IDLE_TIMEOUT,
}

const dbPoolConfig: PoolConfig = {
  user: env.DB_USER,
  password: env.DB_PASSWORD,
  host: env.DB_HOST,
  database: env.DB_DATABASE,
  port: env.DB_PORT,
  ssl: env.DB_SSL,
  max: env.DB_MAX_CONNECTIONS,
  idleTimeoutMillis: env.DB_IDLE_TIMEOUT,
  connectionTimeoutMillis: env.DB_TIMEOUT,
}

export { dbConfig, dbPoolConfig }
