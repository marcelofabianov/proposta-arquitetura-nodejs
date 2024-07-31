import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { PoolConfig } from '../config'
import { PostgresPoolDatabase } from '@/services/database/postgres-pool'
import { PostgresTestContainer } from '&tests/testcontainers/postgres'
import { QueryResultRow } from 'pg'

interface TestTableRow extends QueryResultRow {
  id: number
  name: string
}

describe('PostgresPoolDatabase', () => {
  let postgresTestContainer: PostgresTestContainer
  let postgresDatabase: PostgresPoolDatabase

  beforeAll(async () => {
    postgresTestContainer = new PostgresTestContainer()
    await postgresTestContainer.createContainer()

    const options: PoolConfig = {
      user: postgresTestContainer.getOptions().user,
      host: postgresTestContainer.getOptions().host,
      database: postgresTestContainer.getOptions().database,
      password: postgresTestContainer.getOptions().password,
      port: postgresTestContainer.getOptions().port,
      connectionTimeoutMillis: 30000,
      idleTimeoutMillis: 60000,
      max: 10,
      min: 2,
    }

    postgresDatabase = new PostgresPoolDatabase(options)
  })

  afterAll(async () => {
    await postgresTestContainer.stopContainer()
  }, 10000)

  it('should connect to the database and execute a query', async () => {
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
