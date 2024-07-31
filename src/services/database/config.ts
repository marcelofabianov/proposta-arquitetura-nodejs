import { ClientConfig as ClientConfigPG } from 'pg'
import { ConnectionOptions } from 'tls'

export interface ClientConfig extends ClientConfigPG {}

export interface PoolConfig {
  user?: string
  password?: string
  host?: string
  database?: string
  port?: number
  ssl?: boolean | ConnectionOptions
  max: number
  idleTimeoutMillis: number
  connectionTimeoutMillis: number
}
