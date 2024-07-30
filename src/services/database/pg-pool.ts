import { Pool } from 'pg'
import { env } from '@/config/env'
import { DatabaseConnectionError } from '@/modules/_core/infrastructure/error'

async function ping(pool: Pool): Promise<void> {
  try {
    await pool.query('SELECT 1')
    console.log('Database connection successful')
  } catch (error: unknown) {
    let errorMessage: string

    if (error instanceof Error) {
      errorMessage = `Failed to ping the database: ${error.message}`
    } else {
      errorMessage = 'An unknown error occurred during the database ping'
    }

    throw new DatabaseConnectionError(errorMessage)
  }
}

export function createPool(): Pool {
  try {
    const pool = new Pool({
      user: env.DB_USER,
      password: env.DB_PASSWORD,
      host: env.DB_HOST,
      database: env.DB_DATABASE,
      port: env.DB_PORT,
      ssl: env.DB_MODE === 'disable' ? false : { rejectUnauthorized: false },
      max: env.DB_MAX_CONNECTIONS,
      idleTimeoutMillis: env.DB_IDLE_TIMEOUT,
      connectionTimeoutMillis: env.DB_TIMEOUT,
    })

    ping(pool)

    return pool
  } catch (error: unknown) {
    let errorMessage: string

    if (error instanceof Error) {
      errorMessage = `Failed to initialize the database pool: ${error.message}`
    } else {
      errorMessage =
        'An unknown error occurred while initializing the database pool'
    }

    throw new DatabaseConnectionError(errorMessage)
  }
}

export const pool = createPool()
