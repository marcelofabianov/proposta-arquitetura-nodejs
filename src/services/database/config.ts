import { ClientConfig as ClientConfigPG, PoolConfig as PoolConfigPG } from 'pg'

export interface ClientConfig extends ClientConfigPG {}

export interface PoolConfig extends PoolConfigPG {}
