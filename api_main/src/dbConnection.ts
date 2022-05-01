import pg from 'pg'
import bluebird from 'bluebird'

import { escapePostgresql } from './utils/sql'

const DATABASE_PORT = Number(process.env.DATABASE_PORT) || 5432

const pool = new pg.Pool({
  Promise: bluebird,
  host: process.env.DATABASE_HOST || 'localhost',
  port: Number.isInteger(DATABASE_PORT) ? DATABASE_PORT : 5432,
  database: process.env.DATABASE_NAME,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
})
const schema = process.env.DATABASE_SCHEMA

interface PollVlientWithAuxProps extends pg.PoolClient {
  isSetup: boolean
}

async function getConnection() {
  const client = await pool.connect().catch(err => {
    console.error('getConnection', err)
    throw err
  }) as PollVlientWithAuxProps
  if (!client.isSetup) {
    await client.query(`SET search_path TO ${escapePostgresql(schema)}`)
    client.isSetup = true
  }
  return client
}
export async function executeWithConnection<T>(fn: (client: pg.PoolClient) => T) {
  const client = await getConnection() as pg.PoolClient
  let result
  try {
    result = fn(client)
    return result
  } catch (error) {
    await client.query('ROLLBACK')
    console.error(error)
    console.error((error as any).stack)

    throw error
  } finally {
    client.release()
  }
}

export default {}
