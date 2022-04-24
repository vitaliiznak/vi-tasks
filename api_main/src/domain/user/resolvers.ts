/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { TAuthorizedUser } from '../../server'
import UserService from '../../services/user'

const userGetById = (
  _prev,
  { id }, // {req, res}
  { user }: {
    user: TAuthorizedUser
  },
  _info,
) => UserService.getById(id, { performedByUser: user.id })

const userGetList = (
  _prev,
  _args, // {req, res}
  { user }: {
    user: TAuthorizedUser
  },
  _info,
) => UserService.getList({ performedByUser: user.id })

export default {
  Query: {
    userGetList,
    userGetById,
  },
}
