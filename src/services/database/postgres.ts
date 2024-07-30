import { Pool, QueryResult, QueryResultRow } from 'pg'
import { Database, QueryParams } from '@/modules/_core/infrastructure/database'
import { DatabaseQueryError } from '@/modules/_core/infrastructure/error'

export class PostgresDatabase implements Database {
  private pool: Pool

  public constructor(pool: Pool) {
    this.pool = pool
  }

  public async query<T extends QueryResultRow>(
    text: string,
    params?: QueryParams[],
  ): Promise<T[]> {
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
