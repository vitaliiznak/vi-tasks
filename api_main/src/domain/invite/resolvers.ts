import moment from 'moment'
import { TAuthorizedUser } from '../../server'
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import InviteService from '../../services/invite'
import UserService from '../../services/user'
import BoardService from '../../services/board'

const inviteCount = (
  _prev,
  _req,
  { filter },
  _info,
): Promise<number> => InviteService.count(filter)

const inviteGetList = (
  _prev,
  { filter },
  { user }: {
    user: TAuthorizedUser
  },
  _info,
) => {
  return InviteService.getList(filter, { performedByUser: user.id })
}

const inviteGetById = (
  _prev,
  { id },
  { user }: {
    user: TAuthorizedUser
  },
  _info,
) => InviteService.getById(id, { performedByUser: user.id })

const invitePublicGetById = (
  _prev,
  { id },
  { user }: {
    user: TAuthorizedUser
  },
  _info,
) => InviteService.getPublicById(id, { performedByUser: user.id })

const inviteCreate = (
  _prev,
  {
    input:
    {
      boardId,
      description,
    },
  },
  { user }: {
    user: TAuthorizedUser
  },
  _info,
) => InviteService.create({
  boardId,
  description,
  createdBy: user.id,
})

const inviteJoinBoard = (
  _prev,
  {
    input:
    {
      id,
      token,
    },
  },
  { user }: {
    user: TAuthorizedUser
  },
  _info,
) => InviteService.joinBoard({ id, token }, { performedByUser: user.id }) // TaskService.update(id)

const inviteInvalidate = (
  _prev,
  { id }, // {req, res}
  _context,
  _info,
) => InviteService.remove(id)

export default {
  Invite: {
    createdBy({ createdById }) {
      // Filter the hardcoded array of books to only include
      // books that are located at the correct branch
      return UserService.getById(createdById)
    },
    state({ state, expirationTime }) {
      const date = moment()
      // Filter the hardcoded array of books to only include
      // books that are located at the correct branch
      return state === 'NEW' && date.isAfter(expirationTime) ? 'EXPIRED' : state
    },
    board({ boardId }) {
      // Filter the hardcoded array of books to only include
      // books that are located at the correct branch
      return BoardService.getById(boardId)
    },
  },
  Query: {
    inviteCount,
    inviteGetList,
    inviteGetById,
    invitePublicGetById,
    /*    job,
       jobs, */
  },
  Mutation: {
    inviteCreate,
    inviteJoinBoard,
    inviteInvalidate,
  },
}
