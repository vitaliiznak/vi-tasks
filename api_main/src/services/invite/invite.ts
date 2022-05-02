import moment from 'moment'
import crypto from 'crypto'
import util from 'util'

import { ApolloError } from 'apollo-server'
import { executeWithConnection } from '../../dbConnection'
import { TABLES } from '../../constants/db'
import sql, { escapePostgresql } from '../../utils/sql'

const randomBytesP = util.promisify(crypto.randomBytes)

interface TContext {
  performedByUser: string
}

interface TInvite {
  id: string
  boardId: string
  token: string
  state: string
  description: string

  expirationTime: string
  createdById: string
  createdAt: string
}

const SELECT_FIELDS = sql`
  ${TABLES.INVITE_TO_BOARD}.id,
  ${TABLES.INVITE_TO_BOARD}.board as "boardId",
  ${TABLES.INVITE_TO_BOARD}.token,
  ${TABLES.INVITE_TO_BOARD}.state,
  ${TABLES.INVITE_TO_BOARD}.description,

  ${TABLES.INVITE_TO_BOARD}.expiration_time as "expirationTime",
  ${TABLES.INVITE_TO_BOARD}.created_by as "createdById",
  ${TABLES.INVITE_TO_BOARD}.created_at as "createdAt"
`

const getById = (id: string, ctx?: TContext): Promise<TInvite | null> => executeWithConnection(async (conn) => {
  let whereClause = sql` WHERE id = ${escapePostgresql(id)} `
  if (ctx && ctx.performedByUser) {
    whereClause = sql`
        ${whereClause}
          AND ${TABLES.INVITE_TO_BOARD}.board IN
          (SELECT ${TABLES.BOARD_ACCOUNT}.board
            FROM ${TABLES.BOARD_ACCOUNT} WHERE ${TABLES.BOARD_ACCOUNT}.account
            IN (${escapePostgresql(ctx.performedByUser)})
          )`
  }

  const sqlStr = sql`
      SELECT
          ${SELECT_FIELDS}
      FROM ${TABLES.INVITE_TO_BOARD} 
      ${whereClause}
    `

  const result = await conn.query(sqlStr)
  return result.rows.length ? result.rows[0] : null
})


const getPublicById = (id: string, _ctx?: TContext): Promise<TInvite | null> => executeWithConnection(async (conn) => {
  const whereClause = sql` WHERE id = ${escapePostgresql(id)} `

  const sqlStr = sql`
      SELECT
    
  ${TABLES.INVITE_TO_BOARD}.id,
  ${TABLES.INVITE_TO_BOARD}.board as "boardId",
  ${TABLES.INVITE_TO_BOARD}.token,
  ${TABLES.INVITE_TO_BOARD}.state,
  ${TABLES.INVITE_TO_BOARD}.description,

  ${TABLES.INVITE_TO_BOARD}.expiration_time as "expirationTime",
  ${TABLES.INVITE_TO_BOARD}.created_by as "createdById",
  ${TABLES.INVITE_TO_BOARD}.created_at as "createdAt"

      FROM ${TABLES.INVITE_TO_BOARD} 
      ${whereClause}
    `

  const result = await conn.query(sqlStr)
  return result.rows.length ? result.rows[0] : null
})

type TFilter = {
  createdByAnyOf: string[],
  board: string
  stateAnyOf: string[]
  state_NOTAnyOf: string[]
}
const getList = (filter: TFilter, ctx?: TContext): Promise<TInvite[]> => executeWithConnection(async (conn) => {
  let whereClause = sql`WHERE TRUE `

  if (ctx && ctx.performedByUser) {
    whereClause = sql`
        ${whereClause}
          AND ${TABLES.INVITE_TO_BOARD}.board IN
          (SELECT ${TABLES.BOARD_ACCOUNT}.board
            FROM ${TABLES.BOARD_ACCOUNT} WHERE ${TABLES.BOARD_ACCOUNT}.account
            IN (${escapePostgresql(ctx.performedByUser)})
          )`
  }

  if (filter?.board) {
    whereClause = sql`
      ${whereClause}
      AND ${TABLES.INVITE_TO_BOARD}.board = ${escapePostgresql(filter?.board)}`
  }

  if (filter?.createdByAnyOf?.length) {
    whereClause = sql`
      ${whereClause}
      AND ${TABLES.INVITE_TO_BOARD}.created_by
      IN(${filter.createdByAnyOf.map((el) => escapePostgresql(el)).join(', ')})`
  }

  if (filter?.createdByAnyOf?.length) {
    whereClause = sql`
      ${whereClause}
      AND ${TABLES.INVITE_TO_BOARD}.board
      IN(
        ${filter.createdByAnyOf.map((el) => escapePostgresql(el)).join(', ')})`
  }
  // @TODO change this logic
  if (filter?.state_NOTAnyOf?.length) {
    if (filter.state_NOTAnyOf.includes('NEW')) { // or any other not expired state
      whereClause = sql`
        ${whereClause}
        AND ( 
          ${TABLES.INVITE_TO_BOARD}.expiration_time <= now() 
          OR ${TABLES.INVITE_TO_BOARD}.state != 'NEW' 
        )
        `
    } else {
      whereClause = sql`
        ${whereClause}
        AND ${TABLES.INVITE_TO_BOARD}.state NOT IN 
        (${filter.state_NOTAnyOf.map((el) => escapePostgresql(el)).join(', ')})`
    }
  }

  if (filter?.stateAnyOf?.length) {
    const whereClausesOr: string[] = []
    let stateArray = filter.stateAnyOf
    if (stateArray.includes('EXPIRED')) {
      whereClausesOr.push(
        sql`(${TABLES.INVITE_TO_BOARD}.expiration_time <= now() AND ${TABLES.INVITE_TO_BOARD}.state = 'NEW' )`)
      stateArray = stateArray.filter(el => el != 'EXPIRED')
    }

    if (stateArray.includes('NEW')) {
      whereClausesOr.push(
        sql`( ${TABLES.INVITE_TO_BOARD}.expiration_time >= now() AND ${TABLES.INVITE_TO_BOARD}.state = 'NEW' )`)
      stateArray = stateArray.filter(el => el != 'NEW')
    }
    if (stateArray.length) {
      whereClausesOr.push(
        sql`${TABLES.INVITE_TO_BOARD}.state IN (${stateArray.map((el) => escapePostgresql(el)).join(', ')})`)
    }
    if (whereClausesOr.length) {
      whereClause = `${whereClause} AND (${whereClausesOr.join(' OR ')})`
    }
  }

  const sqlQuery = sql`
      SELECT
      ${SELECT_FIELDS}
      FROM ${TABLES.INVITE_TO_BOARD}
      ${whereClause}
      ORDER BY ${TABLES.INVITE_TO_BOARD}.created_at DESC
        `
  const result = await conn.query(sqlQuery)
  return result.rows
})

type TFilterCount = TFilter
const count = (filter: TFilterCount): Promise<number> => executeWithConnection(async (conn) => {
  let whereClause = sql`WHERE TRUE `

  if (filter?.board) {
    whereClause = sql`
    ${whereClause}
    AND ${TABLES.INVITE_TO_BOARD}.board
    IN(
      ${[filter.board].map((el) => escapePostgresql(el)).join(', ')})`
  }

  if (filter?.createdByAnyOf?.length) {
    whereClause = sql`
    ${whereClause}
    AND ${TABLES.INVITE_TO_BOARD}.board
    IN(
      ${filter.createdByAnyOf.map((el) => escapePostgresql(el)).join(', ')})`
  }

  const sqlQuery = sql`
    SELECT
      COUNT(${TABLES.INVITE_TO_BOARD}.id) as count
      FROM ${TABLES.INVITE_TO_BOARD}
      ${whereClause}
    `

  const result = await conn.query(sqlQuery)

  return result.rows.length ? result.rows[0].count : null
})

const create = ({
  boardId,
  expirationTime = moment().add(24, 'hours').format(),
  createdBy,
  description,
}: {
  boardId: string,
  createdBy: string,
  expirationTime?: string,
  description?: string
}): Promise<TInvite> => executeWithConnection(
  async (conn) => {
    //const tokenBuff = await randomBytesP(5)
    const token = Math.random().toString(36).substring(2, 7).toUpperCase()
    const insertKeys = ['board', 'token', 'created_by']
    const InviteToBoardInsertRow = [
      escapePostgresql(boardId),
      escapePostgresql(token),
      escapePostgresql(createdBy),
    ]

    if (expirationTime) {
      insertKeys.push('expiration_time')
      InviteToBoardInsertRow.push(escapePostgresql(expirationTime))
    }
    if (description) {
      insertKeys.push('description')
      InviteToBoardInsertRow.push(escapePostgresql(description))
    }

    const InviteToBoardInsertValues = [InviteToBoardInsertRow.join(', ')]
    const sqlStrInvite = sql`
          INSERT INTO ${TABLES.INVITE_TO_BOARD}  
          ( 
            ${insertKeys.join(', ')}
          )
          VALUES ${InviteToBoardInsertValues.map((row) => `( ${row} )`).join(', ')}
          RETURNING ${SELECT_FIELDS};
        `
    let qyertSqlStrInviteResult
    try {
      qyertSqlStrInviteResult = await conn.query(sqlStrInvite)
    } catch (err) {
      if ((err as any).toString().includes('duplicate')) {
        throw new ApolloError((err as any).toString(), 'DUPLICATED_TITLE')
      }
      throw err
    }
    const { rows: [insertedInvite] } = qyertSqlStrInviteResult

    return getById(insertedInvite.id)
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
): Promise<TInvite> => executeWithConnection(async (conn) => {
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

const remove = (id: string): Promise<string> => executeWithConnection(async (conn) => {
  const sqlStr = sql`
      DELETE FROM ${TABLES.BOARD}
      WHERE id = ${escapePostgresql(id)};
    `
  await conn.query(sqlStr)
  return id
})


const joinBoard = (
  { id, token }: {
    id: string
    token: string
  },
  ctx?: TContext,
): Promise<TInvite> => executeWithConnection(async (conn) => {
  const whereClause = sql` 
    WHERE   ${TABLES.INVITE_TO_BOARD}.id = ${escapePostgresql(id)} 
      AND ${TABLES.INVITE_TO_BOARD}.token = ${escapePostgresql(token)} 
      AND ${TABLES.INVITE_TO_BOARD}.expiration_time >= now() 
      AND ${TABLES.INVITE_TO_BOARD}.state = 'NEW'
  `
  const sqlStr = sql`
    UPDATE ${TABLES.INVITE_TO_BOARD}
      SET state = 'USED' 
      ${whereClause}
    RETURNING ${SELECT_FIELDS};
  `
  await conn.query('BEGIN;')

  try {
    const updatedInviteResult = await conn.query(sqlStr)
    const updatedInvite = updatedInviteResult.rows.length ? updatedInviteResult.rows[0] : null
    if (updatedInvite) {
      const BoardAccountInsertRow = [
        escapePostgresql(updatedInvite.boardId),
        escapePostgresql(ctx?.performedByUser),
      ].join(', ')
      const BoardAccountInsertValues = [BoardAccountInsertRow]
      const sqlStrBoardAccount = sql`
          INSERT INTO ${TABLES.BOARD_ACCOUNT}  
          ( 
            board, 
            account
          )
          VALUES ${BoardAccountInsertValues.map((row) => `( ${row} )`).join(', ')}
          RETURNING *;
        `
      await conn.query(sqlStrBoardAccount)
    }
    await conn.query('COMMIT')
    return updatedInvite ? await getById(updatedInvite.id) : null
  } catch (err) {
    await conn.query('ROLLBACK')
    throw err
  }
  /*  const set: Array<string> = []
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
  return getById(id) */
  /**
   * Update token state
   *  
   *  */
})

export default {
  getById,
  getPublicById,
  getList,
  count,
  joinBoard,
  update,
  create,
  remove,
}
