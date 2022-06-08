
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
  ${TABLES.ACCOUNT}.id as "id",
  ${TABLES.ACCOUNT}.email as "email",
  ${TABLES.ACCOUNT}.full_name as "fullName",
  ${TABLES.ACCOUNT}.created_at as "createdAt",
  ${TABLES.ACCOUNT}.avatar as "avatar"
`
const getById = (id: string, ctx?: TContext): Promise<TUser | null> => executeWithConnection(async (conn) => {
  let whereClause = sql`WHERE   ${TABLES.ACCOUNT}.id = ${escapePostgresql(id)} `

  if (ctx && ctx.performedByUser) {
    whereClause = sql`
        ${whereClause}
          AND 
            ${TABLES.BOARD_ACCOUNT}.board 
          IN
          (SELECT ${TABLES.BOARD_ACCOUNT}.board
            FROM ${TABLES.BOARD_ACCOUNT} WHERE ${TABLES.BOARD_ACCOUNT}.account
            IN (${escapePostgresql(ctx.performedByUser)})
          )`
  }

  const sqlStr = sql`
      SELECT DISTINCT
          ${SELECT_FIELDS}
      FROM ${TABLES.ACCOUNT}
      INNER JOIN ${TABLES.BOARD_ACCOUNT}
      ON ${TABLES.BOARD_ACCOUNT}.account = ${TABLES.ACCOUNT}.id
     ${whereClause}
    `
  const result = await conn.query(sqlStr)
  return result.rows.length ? result.rows[0] : null
})

const getList = (filter: { boardId?: string }, ctx: TContext): Promise<TUser[]> => executeWithConnection(async (conn) => {
  let whereClause = sql` WHERE TRUE `

  if (ctx && ctx.performedByUser) {
    whereClause = sql`
        ${whereClause}
          AND 
            ${TABLES.BOARD_ACCOUNT}.board 
          IN
          (SELECT ${TABLES.BOARD_ACCOUNT}.board
            FROM ${TABLES.BOARD_ACCOUNT} WHERE ${TABLES.BOARD_ACCOUNT}.account
            IN (${escapePostgresql(ctx.performedByUser)})
          )`
  }

  if (filter && filter.boardId) {
    whereClause = sql`
    ${whereClause} AND  ${TABLES.BOARD_ACCOUNT}.board = ${escapePostgresql(filter.boardId)}`
  }

  const sqlQuery = sql`
      SELECT
          ${SELECT_FIELDS}
      FROM ${TABLES.ACCOUNT}
      INNER JOIN ${TABLES.BOARD_ACCOUNT}
      ON ${TABLES.BOARD_ACCOUNT}.account = ${TABLES.ACCOUNT}.id
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
