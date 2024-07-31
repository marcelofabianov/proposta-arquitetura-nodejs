import { Client, QueryResult, QueryResultRow } from 'pg'
import { ClientConfig } from '@/services/database/config'
import {
  DatabaseInterface,
  QueryParams,
} from '@/modules/_core/infrastructure/database'
import { DatabaseQueryError } from '@/modules/_core/infrastructure/error'

export class PostgresClientDatabase implements DatabaseInterface {
  private client: Client
  private isConnected: boolean = false

  public constructor(options: ClientConfig) {
    this.client = new Client(options)
  }

  public async connect(): Promise<void> {
    if (!this.isConnected) {
      try {
        await this.client.connect()
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
        await this.client.end()
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
      const result: QueryResult<T> = await this.client.query<T>(text, params)
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
