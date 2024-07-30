import { Client } from 'pg'
import {
  PostgreSqlContainer,
  StartedPostgreSqlContainer,
} from '@testcontainers/postgresql'

export class PostgresTestContainer {
  private container: StartedPostgreSqlContainer | null
  private postgresClient: Client | null

  public constructor() {
    this.container = null
    this.postgresClient = null
  }

  public async createContainer(): Promise<void> {
    try {
      const container = await new PostgreSqlContainer().start()
      const options = {
        user: container.getUsername(),
        host: container.getHost(),
        database: container.getDatabase(),
        password: container.getPassword(),
        port: container.getMappedPort(5432),
      }
      const postgresClient = new Client(options)
      await postgresClient.connect()

      this.container = container
      this.postgresClient = postgresClient
    } catch (error) {
      console.error(
        'Failed to create or connect to the Postgres container:',
        error,
      )
      throw error
    }
  }

  public async stopContainer(): Promise<void> {
    if (!this.container || !this.postgresClient) {
      return
    }

    try {
      await this.postgresClient.end()
      await this.container.stop()
    } catch (error) {
      console.error(
        'Failed to stop the Postgres container or close the client:',
        error,
      )
      throw error
    }
  }

  public async runQuery(query: string): Promise<any[]> {
    if (!this.postgresClient) {
      throw new Error('Postgres client is not initialized')
    }

    try {
      const result = await this.postgresClient.query(query)
      return result.rows
    } catch (error) {
      console.error('Failed to run the query:', error)
      throw error
    }
  }
}
