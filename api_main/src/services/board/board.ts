
import { ApolloError } from 'apollo-server'
import { executeWithConnection } from '../../dbConnection'
import { TABLES } from '../../constants/db'
import sql, { escapePostgresql } from '../../utils/sql'

interface TContext {
  performedByUser: string
}

interface TBoard {
  id: string
  title: string
  description: string
  createdAt: string
  createdById: string
  membersIds: string[]
}

const SELECT_FIELDS = sql`
  ${TABLES.BOARD}.id,
  ${TABLES.BOARD}.title,
  ${TABLES.BOARD}.description,
  ${TABLES.BOARD}.created_at as "createdAt",
  ${TABLES.BOARD}.created_by as "createdById"
`

const getById = (id: string, ctx?: TContext): Promise<TBoard | null> => executeWithConnection(async (conn) => {
  let whereClause = sql` WHERE id = ${escapePostgresql(id)} `

  if (ctx && ctx.performedByUser) {
    whereClause = sql`
        ${whereClause}
          AND ${TABLES.BOARD}.id IN
          (SELECT ${TABLES.BOARD_ACCOUNT}.board
            FROM ${TABLES.BOARD_ACCOUNT} WHERE ${TABLES.BOARD_ACCOUNT}.account
            IN (${escapePostgresql(ctx.performedByUser)})
          )`
  }

  const sqlStr = sql`
      SELECT
          ${SELECT_FIELDS},
          ARRAY_REMOVE( 
            ARRAY(
              SELECT ${TABLES.BOARD_ACCOUNT}.account
              FROM ${TABLES.BOARD_ACCOUNT}
              WHERE 
                ${TABLES.BOARD_ACCOUNT}.board = ${escapePostgresql(id)}
            ), NULL
          ) as 
          "membersIds"
      FROM ${TABLES.BOARD} 
      ${whereClause}
    `
  const result = await conn.query(sqlStr)
  return result.rows.length ? result.rows[0] : null
})

interface TFilter {
  createdBy: string[]
}
const getList = (filter: TFilter, ctx?: TContext): Promise<TBoard[]> => executeWithConnection(async (conn) => {
  let whereClause = sql`WHERE TRUE `

  if (ctx && ctx.performedByUser) {
    whereClause = sql`
        ${whereClause}
          AND ${TABLES.BOARD}.id IN
          (SELECT ${TABLES.BOARD_ACCOUNT}.board
            FROM ${TABLES.BOARD_ACCOUNT} WHERE ${TABLES.BOARD_ACCOUNT}.account
            IN (${escapePostgresql(ctx.performedByUser)})
          )`
  }

  if (filter?.createdBy?.length) {
    whereClause = sql`
      ${whereClause}
      AND ${TABLES.BOARD}.created_by
      IN(${filter.createdBy.map((el) => escapePostgresql(el)).join(', ')})`
  }
  const sqlQuery = sql`
      SELECT
      ${SELECT_FIELDS},
      ARRAY_REMOVE(
        ARRAY_AGG(
          ${TABLES.BOARD_ACCOUNT}.account
        ),
        NULL) as "assignersIds"
      FROM ${TABLES.BOARD}
      LEFT JOIN ${TABLES.BOARD_ACCOUNT}
      ON ${TABLES.BOARD}.id = ${TABLES.BOARD_ACCOUNT}.board
      ${whereClause}
      GROUP BY ${TABLES.BOARD}.id
      ORDER BY ${TABLES.BOARD}.created_at DESC
        `

  const result = await conn.query(sqlQuery)
  return result.rows
})

type TFilterCount = TFilter
const count = (filter: TFilterCount): Promise<number> => executeWithConnection(async (conn) => {
  let whereClause = sql`WHERE TRUE `

  if (filter?.createdBy?.length) {
    whereClause = sql`
    ${whereClause}
    AND ${TABLES.BOARD}.created_by
    IN(
      ${filter.createdBy.map((el) => escapePostgresql(el)).join(', ')})`
  }

  const sqlQuery = sql`
    SELECT
    COUNT(${TABLES.BOARD}.id) as count
    FROM ${TABLES.BOARD}
    LEFT JOIN ${TABLES.BOARD_ACCOUNT}
    ON ${TABLES.BOARD}.id = ${TABLES.BOARD_ACCOUNT}.board
    ${whereClause}
      `
  const result = await conn.query(sqlQuery)
  return result.rows.length ? result.rows[0].count : null
})

const create = ({
  title,
  createdBy,
}: {
  title: string,
  createdBy: string,
}): Promise<TBoard> => executeWithConnection(
  async (conn) => {
    const BoardInsertRow = [
      escapePostgresql(title),
      escapePostgresql(createdBy),
    ].join(', ')
    const BoardInsertValues = [BoardInsertRow]

    const sqlStrAccount = sql`
          INSERT INTO ${TABLES.BOARD}  
          ( 
            title, 
            created_by
          )
          VALUES ${BoardInsertValues.map((row) => `( ${row} )`).join(', ')}
          RETURNING ${SELECT_FIELDS};
        `
    let qyertSqlStrAccountResult
    try {
      qyertSqlStrAccountResult = await conn.query(sqlStrAccount)
    } catch (err) {
      if ((err as any).toString().includes('duplicate')) {
        throw new ApolloError((err as any).toString(), 'DUPLICATED_TITLE')
      }
      throw err
    }
    const { rows: [insertedBoard] } = qyertSqlStrAccountResult

    const BoardAccountInsertRow = [
      escapePostgresql(insertedBoard.id),
      escapePostgresql(createdBy),
    ].join(', ')
    const BoardAccountInsertValues = [BoardAccountInsertRow]
    const sqlStrBoardAccount = sql`
          INSERT INTO ${TABLES.BOARD_ACCOUNT}  
          ( 
            board, 
            account
          )
          VALUES ${BoardAccountInsertValues.map((row) => `( ${row} )`).join(', ')}
          ON CONFLICT (board, account) DO NOTHING
          RETURNING *;
        `
    const { rows: [insertedBoardAccount] } = await conn.query(sqlStrBoardAccount)
    return getById(insertedBoardAccount.board)
  },
)

const update = (
  id: string, {
    title,
    description,
  }: {
    title?: string,
    description?: string
  },
): Promise<TBoard> =>
  executeWithConnection(async (conn) => {
    const set: Array<string> = []
    if (title !== undefined) {
      set.push(sql`title = ${escapePostgresql(title)}`)
    }

    if (description !== undefined) {
      set.push(sql`description = ${escapePostgresql(description)}`)
    }

    if (set.length) {
      const sqlStr = sql` 
      UPDATE ${TABLES.BOARD}  
      SET  
        ${set.join(',')} 
      WHERE id = ${escapePostgresql(id)} 
      RETURNING ${SELECT_FIELDS}; 
    `
      await conn.query(sqlStr)
    }

    return getById(id)
  })

const remove = (id: string): Promise<number> => executeWithConnection(async (conn) => {
  const sqlStr = sql`
      DELETE FROM ${TABLES.BOARD}
      WHERE id = ${escapePostgresql(id)};
    `
  await conn.query(sqlStr)
  return id
})

export default {
  getById,
  getList,
  count,

  update,
  create,
  remove,
}
