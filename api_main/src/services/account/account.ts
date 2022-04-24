/* eslint-disable @typescript-eslint/explicit-module-boundary-types */

import util from 'util'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import { executeWithConnection } from '../../dbConnection'
import { TABLES } from '../../constants/db'
import { saveFileList } from '../../utils/files'
import sql, { escapePostgresql } from '../../utils/sql'


export type TAccount = {
  id: string
  email: string
  fullName: string
  createdAt: string
  avatar: {
    file: {
      uri?: string
      filename?: string
      mimetype?: string
      encoding?: string
      ext?: string
    }
  },
}

export interface TAccountWithToken extends TAccount {
  token: string
}

const comparePFunc = util.promisify(bcrypt.compare)
const hashPFn = util.promisify(bcrypt.hash)
const saltRounds = 10

const SELECT_FIELDS = sql`
  id,
  email,
  full_name as "fullName",
  created_at as "createdAt",
  avatar AS "avatar"
`

const getById = (id): Promise<TAccount | null> => executeWithConnection(async (conn) => {
  const sqlStr = sql`
    SELECT
    ${SELECT_FIELDS}
    FROM ${TABLES.ACCOUNT}
    WHERE id = ${escapePostgresql(id)}
    `
  const result = await conn.query(sqlStr)
  return result.rows.length ? result.rows[0] : null
})

const getList = (): Promise<TAccount[]> => executeWithConnection(async (conn) => {
  const sqlQuery = sql`
      SELECT
        ${SELECT_FIELDS}
      FROM ${TABLES.ACCOUNT}
      ORDER BY ${TABLES.ACCOUNT}.created_at DESC
    `
  const result = await conn.query(sqlQuery)
  return result.rows
})

const signup = ({
  fullName,
  email,
  password,
}: {
  fullName: string
  email: string
  password: string
}): Promise<TAccountWithToken> => executeWithConnection(async (conn) => {
  const passwordHash = await hashPFn(password, saltRounds)
  const sqlStr = sql`
      INSERT INTO ${TABLES.ACCOUNT}
      (email, full_name, password_hash)
      VALUES (${escapePostgresql(email)}, ${escapePostgresql(fullName)}, ${escapePostgresql(passwordHash)})
      RETURNING ${SELECT_FIELDS};
      `
  const result = await conn.query(sqlStr)
  if (!result.rows.length) {
    return null
  }
  const user = result.rows[0]
  const token = jwt.sign({ data: { id: user.id } }, process.env.JWT_SECRET as string, { expiresIn: '20h' })
  return { ...user, token }
})

const login = ({
  email,
  password,
}: {
  email: string,
  password: string
}): Promise<TAccountWithToken> => executeWithConnection(async (conn) => {
  const sqlStr = sql`
      SELECT
      ${SELECT_FIELDS}, password_hash as "passwordHash"
      FROM ${TABLES.ACCOUNT}
      WHERE email = ${escapePostgresql(email)};
      `
  const result = await conn.query(sqlStr)
  if (!result.rows.length) {
    return null
  }
  const user = result.rows[0]
  const isPasswordValid = await comparePFunc(password, user.passwordHash)
  if (!isPasswordValid) {
    return null
  }
  const token = jwt.sign({ data: { id: user.id } }, process.env.JWT_SECRET as string, { expiresIn: '20h' })
  return { ...user, password, token }
})

const update = (id: string, {
  fullName, email, avatar, removeAvatar,
}: {
  fullName?: string
  email?: string
  avatar?: {
    file?: {
      uri: string
      filename: string
      mimetype: string
      encoding: string
      ext: string
      originFileObj
    }
  }
  removeAvatar?: boolean
}): Promise<TAccount> => executeWithConnection(async (conn) => {
  const set: Array<string> = []
  if (fullName) {
    set.push(sql`full_name = ${escapePostgresql(fullName)} `)
  }
  if (email) {
    set.push(sql`email = ${escapePostgresql(email)} `)
  }
  if (avatar?.file !== undefined) {
    const saveFileListResult = await saveFileList(avatar?.file ? [avatar?.file] : [])
    const avatarDataToUpdate = {
      file: saveFileListResult[0]
    }
    if (saveFileListResult.length > 0) {
      set.push(sql`avatar = '${JSON.stringify(avatarDataToUpdate)}'`)
    }
  }
  if (removeAvatar) {
    set.push(sql`avatar = null`)
  }
  if (!set.length) {
    return getById(id)
  }
  const sqlStr = sql`
    UPDATE ${TABLES.ACCOUNT}
    SET
    ${set.join(',')}
    WHERE id = ${escapePostgresql(id)}
    RETURNING ${SELECT_FIELDS};
    `
  const result = await conn.query(sqlStr)
  return result.rows.length ? result.rows[0] : null
})

export default {
  login,
  signup,

  getById,
  getList,
  update,
}
