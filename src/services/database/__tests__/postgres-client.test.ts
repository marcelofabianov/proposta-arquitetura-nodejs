import { describe, it, expect, beforeAll, afterAll } from 'vitest'
import { QueryResultRow } from 'pg'
import { ClientConfig } from '../config'
import { PostgresClientDatabase } from '@/services/database/postgres-client'
import { PostgresTestContainer } from '&tests/testcontainers/postgres'

interface TestTableRow extends QueryResultRow {
  id: number
  name: string
}

describe('PostgresClientDatabase', () => {
  let postgresTestContainer: PostgresTestContainer
  let postgresDatabase: PostgresClientDatabase

  beforeAll(async () => {
    postgresTestContainer = new PostgresTestContainer()
    try {
      await postgresTestContainer.createContainer()
    } catch (error) {
      console.error('Error creating Postgres container:', error)
      throw error
    }

    const options: ClientConfig = {
      user: postgresTestContainer.getOptions().user,
      host: postgresTestContainer.getOptions().host,
      database: postgresTestContainer.getOptions().database,
      password: postgresTestContainer.getOptions().password,
      port: postgresTestContainer.getOptions().port,
    }

    postgresDatabase = new PostgresClientDatabase(options)
  })

  afterAll(async () => {
    try {
      await postgresDatabase.disconnect()
    } catch (error) {
      console.error('Error disconnecting Postgres client:', error)
    }

    try {
      await postgresTestContainer.stopContainer()
    } catch (error) {
      console.error('Error stopping Postgres container:', error)
    }
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
