
import { executeWithConnection } from '../../dbConnection'
import { TABLES } from '../../constants/db'
import sql, { escapePostgresql } from '../../utils/sql'

interface TContext {
  performedByUser: string
}

interface TUser {
  id: string
  email: string
  fullName: string
  createdAt: string
  avatar: {
    file?: {
      uri?: string
      filename?: string
      mimetype?: string
      encoding?: string
      ext?: string
    }
  }
}

const SELECT_FIELDS = sql`
  id,
  email,
  full_name as "fullName",
  created_at as "createdAt",
  avatar as "avatar"
`
const getById = (id: string, ctx?: TContext): Promise<TUser | null> => executeWithConnection(async (conn) => {
  let whereClause = sql`WHERE id = ${escapePostgresql(id)} `

  if (ctx && ctx.performedByUser) {
    whereClause = sql`
        ${whereClause}
          AND 
            ${TABLES.ACCOUNT}.id 
          IN
          (SELECT ${TABLES.BOARD_ACCOUNT}.account
            FROM ${TABLES.BOARD_ACCOUNT} WHERE ${TABLES.BOARD_ACCOUNT}.account
            IN (${escapePostgresql(ctx.performedByUser)})
          )`
  }

  const sqlStr = sql`
      SELECT
          ${SELECT_FIELDS}
      FROM ${TABLES.ACCOUNT} 
     ${whereClause}
    `
  const result = await conn.query(sqlStr)
  return result.rows.length ? result.rows[0] : null
})

const getList = (ctx: TContext): Promise<TUser[]> => executeWithConnection(async (conn) => {
  let whereClause = sql` WHERE TRUE `

  if (ctx && ctx.performedByUser) {
    whereClause = sql`
        ${whereClause}
          AND 
            ${TABLES.ACCOUNT}.id 
          IN
          (SELECT ${TABLES.BOARD_ACCOUNT}.account
            FROM ${TABLES.BOARD_ACCOUNT} WHERE ${TABLES.BOARD_ACCOUNT}.account
            IN (${escapePostgresql(ctx.performedByUser)})
          )`
  }

  const sqlQuery = sql`
      SELECT
          ${SELECT_FIELDS}
      FROM ${TABLES.ACCOUNT}
      ${whereClause}
      ORDER BY ${TABLES.ACCOUNT}.created_at DESC
    `
  const result = await conn.query(sqlQuery)
  return result.rows
})

export default {
  getById,
  getList,
}
