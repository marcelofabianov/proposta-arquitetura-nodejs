import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { ClientConfig, QueryResultRow } from 'pg'
import { PostgresDatabase } from '@/services/database/postgres'
import { PostgresTestContainer } from '&tests/testcontainers/postgres'

interface TestTableRow extends QueryResultRow {
  id: number
  name: string
}

describe('PostgresDatabase', () => {
  let postgresTestContainer: PostgresTestContainer
  let postgresDatabase: PostgresDatabase

  beforeAll(async () => {
    postgresTestContainer = new PostgresTestContainer()
    await postgresTestContainer.createContainer()

    const options: ClientConfig = {
      user: postgresTestContainer.getOptions().user,
      host: postgresTestContainer.getOptions().host,
      database: postgresTestContainer.getOptions().database,
      password: postgresTestContainer.getOptions().password,
      port: postgresTestContainer.getOptions().port,
    }

    postgresDatabase = new PostgresDatabase(options)
  })

  afterAll(async () => {
    await postgresDatabase.disconnect()
    await postgresTestContainer.stopContainer()
  })

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
