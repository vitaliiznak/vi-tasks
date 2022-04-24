
import { executeWithConnection } from '../../dbConnection'
import { TABLES } from '../../constants/db'
import { saveFileList } from '../../utils/files'
import sql, { escapePostgresql } from '../../utils/sql'

interface TTask {
  id: string
  title: string
  description: string
  priority: string
  state: string
  attachments: string
  isArchived: string
  createdAt: string
  createdById: string

  assignersIds: string[]
}

const SELECT_FIELDS = sql`
  ${TABLES.TASK}.id,
  ${TABLES.TASK}.title,
  ${TABLES.TASK}.description,
  ${TABLES.TASK}.priority,
  ${TABLES.TASK}.state,
  ${TABLES.TASK}.attachments,
  ${TABLES.TASK}.extra,
  ${TABLES.TASK}.is_archived as "isArchived",
  ${TABLES.TASK}.created_at as "createdAt",
  ${TABLES.TASK}.created_by as "createdById"
`

type TContext = {
  performedByUser: string
}

const getById = (id: string, ctx?: TContext): Promise<TTask | null> => executeWithConnection(async (conn) => {
  let whereClause = sql`WHERE id = ${escapePostgresql(id)} `

  if (ctx && ctx.performedByUser) {
    whereClause = sql`
        ${whereClause}
          AND
        ${TABLES.TASK}.board IN 
          (SELECT ${TABLES.BOARD_ACCOUNT}.board FROM ${TABLES.BOARD_ACCOUNT} WHERE ${TABLES.BOARD_ACCOUNT}.account
            IN (${escapePostgresql(ctx.performedByUser)})
          )`
  }

  const sqlStr = sql`
      SELECT
          ${SELECT_FIELDS},
          ARRAY_REMOVE( 
            ARRAY(
              SELECT ${TABLES.TASK_ASSIGMENT}.account
              FROM ${TABLES.TASK_ASSIGMENT}
              WHERE 
                ${TABLES.TASK_ASSIGMENT}.task = ${escapePostgresql(id)}
            ), NULL
          ) as 
          "assignersIds"
          
      FROM ${TABLES.TASK} 
      ${whereClause}
    `
  const result = await conn.query(sqlStr)
  return result.rows.length ? result.rows[0] : null
})

type TFilterList = {
  isArchived?: boolean
  createdByAnyOf?: string[]
  assignersAnyOf?: string[]
  prioritiesAnyOf?: string[]
  searchTitle?: string
  searchDescription?: string
  board: string
}
const getList = (filter: TFilterList, ctx?: TContext): Promise<TTask[]> => executeWithConnection(async (conn) => {
  let whereClause = sql`WHERE TRUE `

  if (ctx?.performedByUser) {
    whereClause = sql`
        ${whereClause}
          AND
        ${TABLES.TASK}.board IN 
          (SELECT ${TABLES.BOARD_ACCOUNT}.board FROM ${TABLES.BOARD_ACCOUNT} WHERE ${TABLES.BOARD_ACCOUNT}.account
            IN (${escapePostgresql(ctx.performedByUser)})
          )`
  }

  if (filter.board) {
    whereClause = sql`
        ${whereClause}
        AND
        ${TABLES.TASK}.board = ${escapePostgresql(filter.board)} `
  }

  if (filter?.isArchived !== undefined) {
    whereClause = sql`
        ${whereClause}
        AND
        ${TABLES.TASK}.is_archived = ${escapePostgresql(filter.isArchived)} `
  }

  if (filter?.createdByAnyOf?.length) {
    whereClause = sql`
        ${whereClause}
        AND ${TABLES.TASK}.created_by
        IN(${filter.createdByAnyOf.map((el) => escapePostgresql(el)).join(', ')})`
  }

  if (filter?.assignersAnyOf?.length) {
    whereClause = sql`
        ${whereClause}
        AND ${TABLES.TASK_ASSIGMENT}.account
        IN(${filter.assignersAnyOf.map((el) => escapePostgresql(el)).join(', ')})`
  }
  if (filter?.prioritiesAnyOf?.length) {
    whereClause = sql`
        ${whereClause}
        AND ${TABLES.TASK}.priority
        IN(
          ${filter.prioritiesAnyOf.map((el) => escapePostgresql(el)).join(', ')})`
  }
  if (filter?.searchTitle?.length) {
    whereClause = sql`
        ${whereClause}
        AND
        ${TABLES.TASK}.title @@plainto_tsquery(
          ${escapePostgresql(filter.searchTitle)}
        )`
  }
  if (filter?.searchDescription?.length) {
    whereClause = sql`
        ${whereClause}
        AND
        ${TABLES.TASK}.description @@plainto_tsquery(
          ${escapePostgresql(filter.searchDescription)}
        )`
  }

  const sqlQuery = sql`
        SELECT
        ${SELECT_FIELDS},
        ARRAY_REMOVE(
          ARRAY_AGG(
            ${TABLES.TASK_ASSIGMENT}.account
          ),
          NULL) as "assignersIds"
        FROM ${TABLES.TASK}
        LEFT JOIN ${TABLES.TASK_ASSIGMENT}
        ON ${TABLES.TASK}.id = ${TABLES.TASK_ASSIGMENT}.task
        ${whereClause}
        GROUP BY ${TABLES.TASK}.id
        ORDER BY ${TABLES.TASK}.created_at DESC
    `
  const result = await conn.query(sqlQuery)
  return result.rows
})

type TFilterListCount = {
  isArchived?: boolean
  createdByAnyOf?: string[]
  assignersAnyOf?: string[]
  prioritiesAnyOf?: string[]
  searchTitle?: string
  searchDescription?: string
  board: string
}

const count = (filter: TFilterListCount, ctx?: TContext): Promise<number> => executeWithConnection(async (conn) => {
  let whereClause = sql`WHERE TRUE`

  if (ctx?.performedByUser) {
    whereClause = sql`
      ${whereClause}
        AND
      ${TABLES.TASK}.board IN 
        (SELECT ${TABLES.BOARD_ACCOUNT}.board FROM ${TABLES.BOARD_ACCOUNT} WHERE ${TABLES.BOARD_ACCOUNT}.account
          IN (${escapePostgresql(ctx.performedByUser)})
        )`
  }

  if (filter?.isArchived !== undefined) {
    whereClause = sql`
      ${whereClause}
      AND
      ${TABLES.TASK}.is_archived = ${escapePostgresql(filter.isArchived)} `
  }

  if (filter?.createdByAnyOf?.length) {
    whereClause = sql`
      ${whereClause}
      AND ${TABLES.TASK}.created_by
      IN(
        ${filter.createdByAnyOf.map((el) => escapePostgresql(el)).join(', ')})`
  }

  if (filter?.assignersAnyOf?.length) {
    whereClause = sql`
      ${whereClause}
      AND ${TABLES.TASK_ASSIGMENT}.account
      IN(
        ${filter.assignersAnyOf.map((el) => escapePostgresql(el)).join(', ')})`
  }
  if (filter?.prioritiesAnyOf?.length) {
    whereClause = sql`
      ${whereClause}
      AND ${TABLES.TASK}.priority
      IN(
        ${filter.prioritiesAnyOf.map((el) => escapePostgresql(el)).join(', ')})`
  }
  if (filter?.searchTitle?.length) {
    whereClause = sql`
      ${whereClause}
      AND
      ${TABLES.TASK}.title @@plainto_tsquery(
        ${escapePostgresql(filter.searchTitle)}
      )`
  }
  if (filter?.searchDescription?.length) {
    whereClause = sql`
      ${whereClause}
      AND
      ${TABLES.TASK}.description @@plainto_tsquery(
        ${escapePostgresql(filter.searchDescription)}
      )`
  }

  const sqlQuery = sql`
    SELECT
    COUNT(${TABLES.TASK}.id) as count
    FROM ${TABLES.TASK}
    LEFT JOIN ${TABLES.TASK_ASSIGMENT}
    ON ${TABLES.TASK}.id = ${TABLES.TASK_ASSIGMENT}.task
    ${whereClause}
    `
  const result = await conn.query(sqlQuery)
  return result.rows.length ? result.rows[0].count : null
})

const create = ({
  board,
  title,
  description,
  priority,
  state,
  attachments,
  createdBy,
  assigners = [],
}: {
  board: string,
  title: string,
  description?: string,
  state?: string,
  priority: string,
  createdBy: string,
  attachments?: any[],
  assigners?: string[]
}): Promise<TTask> => executeWithConnection(
  async (conn) => {
    const saveFileListResult = await saveFileList(attachments || [])
    const insertKeys = [
      'board',
      'title',
      'description',
      'priority',
      'created_by',
      'attachments']
    const taskInsertDataRow = [
      escapePostgresql(board),
      escapePostgresql(title),
      escapePostgresql(description),
      escapePostgresql(priority),
      escapePostgresql(createdBy),

      `'${JSON.stringify(
        saveFileListResult,
      )}'`,
    ]
    if (state) {
      insertKeys.push('state')
      taskInsertDataRow.push(escapePostgresql(state))
    }

    const taskInsertValues = [taskInsertDataRow.join(', ')]
    let sqlStr = sql`
          INSERT INTO ${TABLES.TASK}  
          ( 
            ${insertKeys.join(', ')}
          )
          VALUES ${taskInsertValues.map((row) => `( ${row} )`).join(', ')}
          RETURNING ${SELECT_FIELDS};
        `
    const { rows: [insertedTask] } = await conn.query(sqlStr)

    if (assigners.length) {
      const AssigmentInsertValues = assigners
        .map((accountId) => [
          escapePostgresql(accountId),
          escapePostgresql(insertedTask.id),
        ].join(', '))
      sqlStr = sql`
        INSERT INTO ${TABLES.TASK_ASSIGMENT}  
        ( 
          account, 
          task
        )
        VALUES ${AssigmentInsertValues.map((row) => `( ${row} )`).join(', ')}
        ON CONFLICT (task, account) DO NOTHING
        ;
      `
      // assign users
      await conn.query(sqlStr)
    }

    return getById(insertedTask.id)
  },
)

const update = (
  id: string, {
    title,
    description,
    priority,
    state,
    isArchived,
    assignersAdd,
    assignersRemove,
  }: {
    title?: string,
    description?: string,
    priority?: string,
    attachments?: any[],
    state?: string,
    isArchived?: boolean,
    assignersAdd?: string[],
    assignersRemove?: string[]
  },
): Promise<TTask> => executeWithConnection(async (conn) => {
  const set: Array<string> = []
  if (title !== undefined) {
    set.push(sql`title = ${escapePostgresql(title)}`)
  }

  if (description !== undefined) {
    set.push(sql`description = ${escapePostgresql(description)}`)
  }

  if (priority !== undefined) {
    set.push(sql`priority = ${escapePostgresql(priority)}`)
  }

  if (state !== undefined) {
    set.push(sql`state = ${escapePostgresql(state)}`)
  }

  if (isArchived !== undefined) {
    set.push(sql`is_archived = ${escapePostgresql(isArchived)}`)
  }

  if (set.length) {
    const sqlStr = sql` 
          UPDATE ${TABLES.TASK}  
          SET  
            ${set.join(',')} 
          WHERE id = ${escapePostgresql(id)} 
          RETURNING ${SELECT_FIELDS}; 
        `
    await conn.query(sqlStr)
  }

  if (assignersAdd && assignersAdd.length) {
    const AssigmentInsertValues = assignersAdd
      .map((accountId) => [
        escapePostgresql(accountId),
        escapePostgresql(id),
      ].join(', '))
    const sqlStr1 = sql` 
            INSERT INTO ${TABLES.TASK_ASSIGMENT}   
            (  
              account,  
              task 
            ) 
            VALUES ${AssigmentInsertValues.map((row) => `( ${row} )`).join(', ')} 
            ON CONFLICT (account, task) DO NOTHING; 
          `
    await conn.query(sqlStr1)
  }

  if (assignersRemove && assignersRemove.length) {
    const sqlStr1 = sql` 
            DELETE FROM ${TABLES.TASK_ASSIGMENT}   
            WHERE (  
            ${assignersRemove.map((accountId) => ` 
              ${TABLES.TASK_ASSIGMENT}.account = ${escapePostgresql(accountId)}`).join(' OR ')} 
              )  
              AND  
              task=${escapePostgresql(id)}; 
              `
    await conn.query(sqlStr1)
  }

  return getById(id)
})

const remove = (id: string): Promise<string> => executeWithConnection(async (conn) => {
  const sqlStr = sql`
      DELETE FROM ${TABLES.TASK}
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
