import { Pool, QueryResult, QueryResultRow } from 'pg'
import { PoolConfig } from '@/services/database/config'

import { DatabaseInterface, QueryParams } from './database-interface'
import { DatabaseQueryError } from '@/modules/_core/infrastructure/error'

export class PostgresPoolDatabase implements DatabaseInterface {
  private pool: Pool
  private isConnected: boolean = false

  public constructor(options: PoolConfig) {
    this.pool = new Pool(options)
  }

  public async connect(): Promise<void> {
    if (!this.isConnected) {
      try {
        await this.pool.connect()
        this.isConnected = true
      } catch (error: unknown) {
        let errorMessage: string

        if (error instanceof Error) {
          errorMessage = `Failed to connect to the database: ${error.message}`
        } else {
          errorMessage =
            'An unknown error occurred while connecting to the database'
        }

        throw new DatabaseQueryError(errorMessage)
      }
    }
  }

  public async disconnect(): Promise<void> {
    if (this.isConnected) {
      try {
        await this.pool.end()
        this.isConnected = false
      } catch (error: unknown) {
        let errorMessage: string

        if (error instanceof Error) {
          errorMessage = `Failed to disconnect from the database: ${error.message}`
        } else {
          errorMessage =
            'An unknown error occurred while disconnecting from the database'
        }

        throw new DatabaseQueryError(errorMessage)
      }
    }
  }

  public async query<T extends QueryResultRow>(
    text: string,
    params?: QueryParams[],
  ): Promise<T[]> {
    await this.connect()

    try {
      const result: QueryResult<T> = await this.pool.query<T>(text, params)
      return result.rows
    } catch (error: unknown) {
      let errorMessage: string

      if (error instanceof Error) {
        errorMessage = `Database query failed: ${error.message}`
      } else {
        errorMessage = 'An unknown error occurred during the database query'
      }

      throw new DatabaseQueryError(errorMessage)
    }
  }
}
