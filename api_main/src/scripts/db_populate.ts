
import util from 'util'
import bcrypt from 'bcrypt'
import faker from '@faker-js/faker'
import { executeWithConnection } from '../dbConnection'
import BoardService from '../services/board'
import TaskService from '../services/task'
import sql, { escapePostgresql } from '../utils/sql'
import { TABLES } from '../constants/db'


const password = '12345'
const saltRounds = 10
const hashPFn = util.promisify(bcrypt.hash)

const predefinedUsersFn = async () => {
  const passwordHash = await hashPFn(password, saltRounds)
  return [[
    escapePostgresql('john@mail.com'),
    escapePostgresql('John Wash'),
    escapePostgresql(passwordHash),
  ].join(', '), [
    escapePostgresql('mike@mail.com'),
    escapePostgresql('Mike Mirrow'),
    escapePostgresql(passwordHash),
  ].join(', '),
  ]
}

const randomUserInsertValueFn = async () => {
  const fullName = `${faker.name.firstName()} ${faker.name.lastName()}`
  const passwordHash = await hashPFn(password, saltRounds)
  return [
    escapePostgresql(faker.internet.email().toLowerCase()),
    escapePostgresql(fullName),
    escapePostgresql(passwordHash),
  ].join(', ')
}

const populateAccounts = () => executeWithConnection(async (conn) => {
  const insertValues = [
    ...await predefinedUsersFn(),
    await randomUserInsertValueFn(),
  ]

  const sqlStr = sql`
          INSERT INTO ${TABLES.ACCOUNT} 
          (email, full_name, password_hash)
          VALUES ${insertValues.map((row) => `( ${row} )`).join(', ')}
          ON CONFLICT (email)
            DO UPDATE
            SET 
              email = excluded.email,
              full_name = excluded.full_name,
              password_hash = excluded.password_hash
          RETURNING id, email,  full_name as fullName;
        `
  const { rows: insertedAccounts } = await conn.query(sqlStr)

  const [person1, person2] = insertedAccounts
  console.info('finish populate accounts')

  // const numTasks = Array.from(Array(10), (_, i) => i)

  // const board1 = await BoardService.create(
  //   {
  //     title: `${`${faker.lorem.slug()} ${1}`}`,
  //     createdBy: person1.id,
  //   },
  // )

  // for (const i of numTasks) {
  //   // eslint-disable-next-line no-await-in-loop
  //   await TaskService.create(
  //     {
  //       title: `${faker.lorem.slug()} ${i}`,
  //       description: `${faker.lorem.text()} ${i}`,
  //       priority: 'LOW',
  //       createdBy: person1.id,
  //       attachments: [],
  //       board: board1.id,
  //     },
  //   )
  // }

  console.info('Populate agents')

  console.info('finish populate agents')

  console.info('Populate agents')

  console.info('finish populate agents')
})

populateAccounts()

export default populateAccounts
