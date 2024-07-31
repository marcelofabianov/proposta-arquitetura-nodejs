import { Client } from 'pg'
import {
  PostgreSqlContainer,
  StartedPostgreSqlContainer,
} from '@testcontainers/postgresql'

export class PostgresClientTestContainer {
  private container: StartedPostgreSqlContainer | null
  private postgresClient: Client | null

  public constructor() {
    this.container = null
    this.postgresClient = null
  }

  public async createContainer(): Promise<void> {
    try {
      const container = await new PostgreSqlContainer().start()

      let isReady = false
      const maxRetries = 10
      const retryInterval = 1000

      for (let i = 0; i < maxRetries; i++) {
        try {
          await container.exec(['pg_isready', '-U', container.getUsername()])
          isReady = true
          break
        } catch (error) {
          if (i < maxRetries - 1) {
            await new Promise((resolve) => setTimeout(resolve, retryInterval))
          } else {
            throw error
          }
        }
      }

      if (!isReady) {
        throw new Error('Postgres container failed to start')
      }

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

  public getOptions(): any {
    if (!this.container) {
      throw new Error('Postgres container is not initialized')
    }

    return {
      user: this.container.getUsername(),
      host: this.container.getHost(),
      database: this.container.getDatabase(),
      password: this.container.getPassword(),
      port: this.container.getMappedPort(5432),
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