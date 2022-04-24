/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { TAuthorizedUser } from '../../server'
import BoardService from '../../services/board'
import UserService from '../../services/user'

const boardCount = (
  _prev,
  _req, // {req, res}
  { filter },
  _info,
) => BoardService.count(filter)

const boardGetList = (
  _prev,
  { filter }, // {req, res}
  { user }: {
    user: TAuthorizedUser
  },
  _info,
) => BoardService.getList(filter, { performedByUser: user.id })

const boardGetById = (
  _prev,
  { id }, // {req, res}
  { user }: {
    user: TAuthorizedUser
  },
  _info,
) => BoardService.getById(id, { performedByUser: user.id })

const boardCreate = (
  _prev,
  {
    input:
    {
      title,
    },
  }, // {req, res}
  { user }: {
    user: TAuthorizedUser
  },
  _info,
) => BoardService.create({
  title,
  createdBy: user.id,
})

const boardUpdate = (
  _prev,
  { id, input },
  _context,
  _info,
) => BoardService.update(id, input) // TaskService.update(id)

const boardRemove = (
  _prev,
  { id }, // {req, res}
  _context,
  _info,
) => BoardService.remove(id)

export default {
  Board: {
    members({ membersIds }) {
      // Filter the hardcoded array of books to only include
      // books that are located at the correct branch
      return Promise.all(membersIds.map((id) => UserService.getById(id)))
    },
    createdBy({ createdById }) {
      // Filter the hardcoded array of books to only include
      // books that are located at the correct branch
      return UserService.getById(createdById)
    },
  },
  Query: {
    boardCount,
    boardGetList,
    boardGetById,
    /*    job,
       jobs, */
  },
  Mutation: {
    boardCreate,
    boardUpdate,
    boardRemove,
  },
}
