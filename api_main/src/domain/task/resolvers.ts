/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { TAuthorizedUser } from '../../server'
import TaskService from '../../services/task'
import UserService from '../../services/user'

const taskCount = (
  _prev,
  { filter }, // {req, res}
  { user },
  _info,
) => TaskService.count(filter, { performedByUser: user.id })

const taskGetList = (
  _prev,
  { filter }, // {req, res}
  { user }: {
    user: TAuthorizedUser
  },
  _info,
) => TaskService.getList(filter, { performedByUser: user.id })

const taskGetById = (
  _prev,
  { id }, // {req, res}
  { user }: {
    user: TAuthorizedUser
  },
  _info,
) => TaskService.getById(id, { performedByUser: user.id })

const taskCreate = (
  _prev,
  {
    input:
    {
      board,
      title,
      description,
      priority,
      state,
      attachments,
      assigners,
    },
  }, // {req, res}
  { user }: {
    user: TAuthorizedUser
  },
  _info,
) => TaskService.create({
  board,
  title,
  description,
  priority,
  state,
  createdBy: user.id,
  attachments,
  assigners,
})

const taskUpdate = (
  _prev,
  { id, input },
  _context,
  _info,
) => TaskService.update(id, input) // TaskService.update(id)

const taskRemove = (
  _prev,
  { id }, // {req, res}
  _context,
  _info,
) => TaskService.remove(id)

const taskChangeState = (
  _prev,
  { id, state }, // {req, res}
  _context,
  _info,
) => TaskService.update(id, {
  state,
})

const taskArchive = (
  _prev,
  { id }, // {req, res}
  _context,
  _info,
) => TaskService.update(id, {
  isArchived: true,
})

const taskUnarchive = (
  _prev,
  { id }, // {req, res}
  _context,
  _info,
) => TaskService.update(id, {
  isArchived: false,
})

export default {
  Task: {
    assigners({ assignersIds }) {
      // Filter the hardcoded array of books to only include
      // books that are located at the correct branch
      return Promise.all(assignersIds.map((id) => UserService.getById(id)))
    },
    createdBy({ createdById }) {
      // Filter the hardcoded array of books to only include
      // books that are located at the correct branch
      return UserService.getById(createdById)
    },
  },
  Query: {
    taskCount,
    taskGetList,
    taskGetById,
    /*    job,
       jobs, */
  },
  Mutation: {
    taskCreate,
    taskUpdate,
    taskRemove,
    taskArchive,
    taskUnarchive,
    taskChangeState,
  },
}
