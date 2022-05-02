/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { TAuthorizedUser } from '../../server'
import UserService from '../../services/user'

const userGetById = (
  _prev,
  { id },
  { user }: {
    user: TAuthorizedUser
  },
  _info,
) => UserService.getById(id, { performedByUser: user.id })

const userGetList = (
  _prev,
  { filter },
  { user }: {
    user: TAuthorizedUser
  },
  _info,
) => UserService.getList(filter, { performedByUser: user.id })

export default {
  Query: {
    userGetList,
    userGetById,
  },
}
