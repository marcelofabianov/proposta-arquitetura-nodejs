import { Pool, PoolClient, PoolConfig } from 'pg'
import {
  PostgreSqlContainer,
  StartedPostgreSqlContainer,
} from '@testcontainers/postgresql'

export class PostgresPoolTestContainer {
  private container: StartedPostgreSqlContainer | null
  private pool: Pool | null

  public constructor() {
    this.container = null
    this.pool = null
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

      const options: PoolConfig = {
        user: container.getUsername(),
        host: container.getHost(),
        database: container.getDatabase(),
        password: container.getPassword(),
        port: container.getMappedPort(5432),
        max: 10,
        idleTimeoutMillis: 60000,
        connectionTimeoutMillis: 30000,
      }

      const pool = new Pool(options)
      await pool.connect()

      this.container = container
      this.pool = pool
    } catch (error) {
      console.error(
        'Failed to create or connect to the Postgres pool container:',
        error,
      )
      throw error
    }
  }

  public async stopContainer(): Promise<void> {
    if (!this.container || !this.pool) {
      console.error('Postgres container or pool is not initialized')
      return
    }
    console.log('Stopping Postgres container and closing the pool...')

    try {
      await this.pool.end()
      await this.container.stop()
    } catch (error) {
      console.error(
        'Failed to stop the Postgres container or close the pool:',
        error,
      )
      throw error
    }

    this.container = null
    this.pool = null

    console.log('Postgres container stopped and pool closed')
  }

  public getOptions(): PoolConfig {
    if (!this.container) {
      throw new Error('Postgres container is not initialized')
    }

    return {
      user: this.container.getUsername(),
      host: this.container.getHost(),
      database: this.container.getDatabase(),
      password: this.container.getPassword(),
      port: this.container.getMappedPort(5432),
      max: 10,
      idleTimeoutMillis: 60000,
      connectionTimeoutMillis: 30000,
    }
  }

  public async runQuery(query: string, params?: any[]): Promise<any[]> {
    if (!this.pool) {
      throw new Error('Postgres pool is not initialized')
    }

    const client: PoolClient = await this.pool.connect()

    try {
      const result = await client.query(query, params)
      return result.rows
    } catch (error) {
      console.error('Failed to run the query:', error)
      throw error
    } finally {
      client.release()
    }
  }
}
