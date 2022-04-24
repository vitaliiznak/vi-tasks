
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck - may need to be at the start of file

import sql from '../src/utils/sql'
import { TABLES, INVITE_STATE } from '../src/constants/db'

let dbm
let type
let seed

/**
 * We receive the dbmigrate dependency from dbmigrate initially.
 * This enables us to not have to rely on NODE_PATH.
 */
exports.setup = function (options, seedLink) {
  dbm = options.dbmigrate
  type = dbm.dataType
  seed = seedLink
}


exports.up = async db => {
  // console.info(db)
  // JOB data
  /*   await db.runSql(`CREATE SCHEMA IF NOT EXISTS airlines;`)
    console.info('create schema')
    await db.runSql(`SET SCHEMA 'airlines';`)
    console.info('set schema') */
  try {
    console.info('Allow extentions')
    let sqlQuery = sql`
      CREATE EXTENSION IF NOT EXISTS "uuid-ossp" SCHEMA "public";
      set search_path to  "public";
    `
    const resultExtention = await db.runSql(sqlQuery)
    console.info('resultExtention', resultExtention)


    console.info(`create ${TABLES.ACCOUNT}`)
    sqlQuery = sql`
      CREATE TABLE ${TABLES.ACCOUNT} (
        id UUID NOT NULL DEFAULT uuid_generate_v4(),
        full_name  VARCHAR (63) NOT NULL,
        email  VARCHAR (63) NOT NULL UNIQUE,
        password_hash  VARCHAR (63) NOT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        avatar JSONB DEFAULT 'null',

        extra JSONB  DEFAULT '{}',

        PRIMARY KEY (id)
      );
    `
    await db.runSql(sqlQuery)
    console.info(`end create ${TABLES.ACCOUNT}`)

    console.info(`create ${TABLES.BOARD}`)
    sqlQuery = sql`
      CREATE TABLE ${TABLES.BOARD} (
        id UUID  PRIMARY KEY NOT NULL DEFAULT uuid_generate_v4(),
        title VARCHAR (63) NOT NULL,
        description TEXT NOT NULL DEFAULT '',
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        created_by UUID REFERENCES ${TABLES.ACCOUNT}(id) ON DELETE CASCADE,
        extra JSONB  DEFAULT '{}'
      );
    `
    await db.runSql(sqlQuery)
    console.info(`end create ${TABLES.BOARD}`)

    console.info(`create ${TABLES.BOARD_ACCOUNT}`)
    sqlQuery = sql`
      CREATE TABLE ${TABLES.BOARD_ACCOUNT} (
        id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        account UUID REFERENCES ${TABLES.ACCOUNT}(id) ON DELETE CASCADE NOT NULL,
        board UUID REFERENCES ${TABLES.BOARD}(id) ON DELETE CASCADE NOT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        
        UNIQUE (account, board)
  
      );`
    await db.runSql(sqlQuery)
    console.info(`end create ${TABLES.BOARD_ACCOUNT}`)

    console.info(`create ${TABLES.TASK}`)
    sqlQuery = sql`
      CREATE TABLE ${TABLES.TASK} (
        id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        title VARCHAR (63),
        description TEXT DEFAULT '',
        priority VARCHAR (63) NOT NULL,
        state VARCHAR (63) DEFAULT 'TODO',
        attachments JSONB DEFAULT '[]',
        is_archived boolean DEFAULT false,
        board UUID REFERENCES ${TABLES.BOARD}(id) ON DELETE CASCADE NOT NULL,
        created_by  UUID REFERENCES ${TABLES.ACCOUNT}(id) ON DELETE CASCADE NOT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        
        extra JSONB DEFAULT '{}'

      );`
    await db.runSql(sqlQuery)
    console.info(`end create ${TABLES.TASK}`)

    console.info(`create ${TABLES.TASK_ASSIGMENT}`)
    sqlQuery = sql`
      CREATE TABLE ${TABLES.TASK_ASSIGMENT} (
        id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        account UUID REFERENCES ${TABLES.ACCOUNT}(id) ON DELETE CASCADE NOT NULL,
        task UUID REFERENCES ${TABLES.TASK}(id) ON DELETE CASCADE NOT NULL ,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        UNIQUE (task, account),

        extra JSONB
      );`
    await db.runSql(sqlQuery)
    console.info(`end create ${TABLES.TASK_ASSIGMENT}`)


    console.info(`create ${TABLES.TASK_AUDIT}`)
    sqlQuery = sql`
      CREATE TABLE ${TABLES.TASK_AUDIT} (
        id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        task UUID REFERENCES ${TABLES.TASK}(id)  NOT NULL UNIQUE,
    
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

        extra JSONB
      );`
    await db.runSql(sqlQuery)
    console.info(`end create ${TABLES.TASK}`)


    console.info(`create ${TABLES.COMMENT}`)
    sqlQuery = sql`
      CREATE TABLE ${TABLES.COMMENT} (
        id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        task UUID REFERENCES ${TABLES.TASK}(id) ON DELETE CASCADE NOT NULL,
        previous UUID REFERENCES ${TABLES.COMMENT}(id) ON DELETE CASCADE,
        content TEXT,
        
        is_removed BOOLEAN DEFAULT FALSE,
        created_by  UUID REFERENCES ${TABLES.ACCOUNT}(id) ON DELETE CASCADE NOT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

        extra JSONB DEFAULT '{}'



      );`
    await db.runSql(sqlQuery)
    console.info(`end create ${TABLES.COMMENT}`)


    // token states: [NEW, USED, EXPIRED, INVALIDATED]
    console.info(`create ${TABLES.INVITE_TO_BOARD}`)
    sqlQuery = sql`
      CREATE TABLE ${TABLES.INVITE_TO_BOARD} (
        id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        board UUID REFERENCES ${TABLES.BOARD}(id) ON DELETE CASCADE NOT NULL,\

        token VARCHAR (63) NOT NULL,
        state VARCHAR (63) DEFAULT '${INVITE_STATE.NEW}' NOT NULL,
        description TEXT DEFAULT '',
        expiration_time  TIMESTAMP NOT NULL,

        created_by  UUID REFERENCES ${TABLES.ACCOUNT}(id) ON DELETE CASCADE NOT NULL,
        created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        
        extra JSONB DEFAULT '{}'
      );`
    await db.runSql(sqlQuery)
    console.info(`end create ${TABLES.TASK}`)


    return true
  } catch (err) {
    console.info(err)
  }
  // appication data

  return true
}

exports.down = async db => {
  for (const table of Object.values(TABLES)) {
    const sqlQuery = `DROP TABLE IF EXISTS ${table} CASCADE;`
    await db.runSql(sqlQuery)
  }

  return true
}

exports._meta = {
  version: 1
}
