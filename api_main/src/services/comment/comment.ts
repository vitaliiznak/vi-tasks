
import { executeWithConnection } from '../../dbConnection'
import { TABLES } from '../../constants/db'
import sql, { escapePostgresql } from '../../utils/sql'


interface TComment {
  id: string
  task: string
  previous: string
  content: string
  isRemoved: string
  createdById: string
  createdAt: string
  replyToUserId?: string
}

const SELECT_FIELDS = sql`
  ${TABLES.COMMENT}.id,
  ${TABLES.COMMENT}.task,
  ${TABLES.COMMENT}.previous,
  ${TABLES.COMMENT}.content,
  ${TABLES.COMMENT}.is_removed as "isRemoved",
  ${TABLES.COMMENT}.created_by AS "createdById",
  ${TABLES.COMMENT}.created_at as "createdAt"
`
const getById = (id: string): Promise<TComment | null> => executeWithConnection(async (conn) => {
  const sqlStr = sql`
        WITH RECURSIVE accum AS (
          (SELECT
            ${SELECT_FIELDS},
            ${TABLES.COMMENT}.previous AS "replyToUserId"
            FROM ${TABLES.COMMENT}
            WHERE ${TABLES.COMMENT}.id = ${escapePostgresql(id)}
            ORDER BY ${TABLES.COMMENT}.created_at DESC
          )
          UNION
          (SELECT
            replies.id,
            replies.task,
            replies.previous,
            replies.content,
            replies.is_removed AS "isRemoved",
            replies.created_by AS "createdById",
            replies.created_at AS "createdAt",
            a."createdById" AS "replyToUserId"
            FROM ${TABLES.COMMENT} replies
            INNER JOIN accum a ON a.id = replies.previous
            ORDER BY replies.created_at DESC
          ) 
        ) 
        SELECT
            *
          FROM
          accum;
      `

  const result = await conn.query(sqlStr)
  return result.rows.length ? result.rows[0] : null
})

const getList = (filter: {
  createdBy?: string,
  task?: string
}, withReplies: boolean): Promise<TComment[]> => executeWithConnection(async (conn) => {
  let whereClause = sql`WHERE TRUE `

  if (filter?.createdBy?.length) {
    whereClause = sql`
          ${whereClause}
          AND ${TABLES.COMMENT}.created_by = ${escapePostgresql(filter.createdBy)} `
  }

  if (filter?.task) {
    whereClause = sql`
          ${whereClause}
          AND ${TABLES.COMMENT}.task = ${escapePostgresql(filter.task)} `
  }

  const sqlNoConcatReplies = sql`SELECT
       ${SELECT_FIELDS}
        FROM ${TABLES.COMMENT}
      ${whereClause}`

  const sqlConcatReplies = sql`
        WITH RECURSIVE accum AS (
          (SELECT
            ${SELECT_FIELDS},
            ${TABLES.COMMENT}.previous AS "replyToUserId"
            FROM ${TABLES.COMMENT}
            ${whereClause}
            AND previous IS NULL
           ORDER BY ${TABLES.COMMENT}.created_at DESC
          )
          UNION
          (SELECT
            replies.id,
            replies.task,
            replies.previous,
            replies.content,
            replies.is_removed AS "isRemoved",
            replies.created_by AS "createdById",
            replies.created_at AS "createdAt",
            a."createdById" AS "replyToUserId"
            FROM ${TABLES.COMMENT} replies
            INNER JOIN accum a ON a.id = replies.previous
            ORDER BY replies.created_at DESC
          ) 
        ) 
        SELECT
            *
          FROM
          accum;
      `
  const sqlQuery = withReplies ? sqlConcatReplies : sqlNoConcatReplies
  const result = await conn.query(sqlQuery)
  return result.rows
})

const count = (filter: {
  createdBy: string[]
  task: string
}): Promise<number> => executeWithConnection(async (conn) => {
  let whereClause = sql`WHERE TRUE`
  if (filter?.createdBy?.length) {
    whereClause = sql`
        ${whereClause}
        AND ${TABLES.COMMENT}.created_by = ${escapePostgresql(filter.createdBy)} `
  }

  if (filter?.task) {
    whereClause = sql`
        ${whereClause}
        AND ${TABLES.COMMENT}.task = ${escapePostgresql(filter.task)} `
  }

  const sqlQuery = sql`
    SELECT COUNT(${TABLES.COMMENT}.id)
    ${whereClause}
    FROM ${TABLES.TASK}
    `
  const result = await conn.query(sqlQuery)
  return result.rows[0].count
})

const create = ({
  content,
  taskId,
  previousId,
  createdBy,
}: {
  content: string,
  taskId: string,
  previousId?: string,
  createdBy: string,
}): Promise<TComment> => executeWithConnection(
  async (conn) => {
    const CommentInsertRow = [
      escapePostgresql(content),
      escapePostgresql(taskId),
      escapePostgresql(previousId),
      escapePostgresql(createdBy),
    ].join(', ')
    const CommentInsertValues = [CommentInsertRow]
    const sqlStr = sql`INSERT INTO ${TABLES.COMMENT}
    (
      content,
      task,
      previous,
      created_by)
    VALUES ${CommentInsertValues.map((row) => `( ${row} )`).join(', ')}
    RETURNING ${SELECT_FIELDS};
    `
    const { rows: [insertedComment] } = await conn.query(sqlStr)
    return getById(insertedComment.id)
  },
)

const createReply = ({
  content,
  previousId,
  createdBy,
}: {
  content: string,
  previousId: string,
  createdBy: string,
}): Promise<TComment> => executeWithConnection(
  async (conn) => {
    const CommentInsertRow = [
      escapePostgresql(content),
      sql`
      (SELECT ${TABLES.TASK}.id 
        FROM ${TABLES.TASK} 
        WHERE ${TABLES.TASK}.id = (
        SELECT ${TABLES.COMMENT}.task
            FROM ${TABLES.COMMENT} 
            WHERE ${TABLES.COMMENT}.id = ${escapePostgresql(previousId)}
      )
        )`,
      escapePostgresql(previousId),
      escapePostgresql(createdBy),
    ].join(', ')
    const CommentInsertValues = [CommentInsertRow]
    const sqlStr = sql`INSERT INTO ${TABLES.COMMENT}
          (
            content,
            task,
            previous,
            created_by)
          VALUES ${CommentInsertValues.map((row) => `( ${row} )`).join(', ')}
          RETURNING ${SELECT_FIELDS};
          `
    const queryResult = await conn.query(sqlStr)
    const { rows: [insertedComment] } = queryResult
    return getById(insertedComment.id)
  },
)

const remove = (id: string): Promise<string> => executeWithConnection(async (conn) => {
  const sqlStr = sql`
      DELETE FROM ${TABLES.COMMENT}
      WHERE id = ${escapePostgresql(id)};
    `
  await conn.query(sqlStr)
  return id
})

export default {
  getById,
  getList,
  count,

  create,
  createReply,
  remove,
}
