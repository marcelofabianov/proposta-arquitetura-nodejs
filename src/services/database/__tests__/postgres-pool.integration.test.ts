import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { PoolConfig } from '../config'
import { PostgresPoolDatabase } from '@/services/database/postgres-pool'
import { PostgresPoolTestContainer } from '&tests/testcontainers/postgres-pool'
import { QueryResultRow } from 'pg'

interface TestTableRow extends QueryResultRow {
  id: number
  name: string
}

describe('PostgresPoolDatabase', () => {
  let postgresPoolTestContainer: PostgresPoolTestContainer
  let postgresDatabase: PostgresPoolDatabase

  beforeAll(async () => {
    postgresPoolTestContainer = new PostgresPoolTestContainer()
    await postgresPoolTestContainer.createContainer()

    const options: PoolConfig = {
      user: postgresPoolTestContainer.getOptions().user,
      host: postgresPoolTestContainer.getOptions().host,
      database: postgresPoolTestContainer.getOptions().database,
      password: postgresPoolTestContainer.getOptions().password,
      port: postgresPoolTestContainer.getOptions().port,
      connectionTimeoutMillis: 30000,
      idleTimeoutMillis: 60000,
      max: 10,
      min: 10,
    }

    postgresDatabase = new PostgresPoolDatabase(options)
  })

  afterAll(async () => {
    try {
      await postgresPoolTestContainer.stopContainer()
    } catch (error) {
      console.error('Failed to stop Postgres container:', error)
    }
  }, 50000)

  it('should connect to the database pool and execute a query', async () => {
    await postgresDatabase.connect()

    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS test_table (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL
      )
    `
    await postgresDatabase.query(createTableQuery)

    const insertQuery = `INSERT INTO test_table (name) VALUES ($1) RETURNING id`
    const insertResult = await postgresDatabase.query<{ id: number }>(
      insertQuery,
      ['Test Name'],
    )
    const insertedId = insertResult[0].id

    const selectQuery = `SELECT * FROM test_table WHERE id = $1`
    const selectResult = await postgresDatabase.query<TestTableRow>(
      selectQuery,
      [insertedId],
    )

    expect(selectResult).toHaveLength(1)
    expect(selectResult[0]).toEqual({ id: insertedId, name: 'Test Name' })
  })
})
