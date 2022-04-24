/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { AuthenticationError } from 'apollo-server'
import { TAuthorizedUser } from '../../server'
import AccountService from '../../services/account'

const accountSignup = async (
  _prev,
  { input: { fullName, email, password } }, // {req, res}
  _context,
  _info,
) => {
  const result = await AccountService.signup({ fullName, email, password })
  return { ...result }
}

const accountLogin = async (
  _prev,
  { email, password }, // {req, res}
  _context,
  _info,
) => {
  const result = await AccountService.login({ email, password })

  if (!result) {
    throw new AuthenticationError('not authorized')
  }

  return { ...result }
}

const accountMe = (
  _prev,
  _args, // {req, res}
  { user }: {
    user: TAuthorizedUser
  },
  _info,
) => (user || null)

const accountUpdate = (
  _prev,
  {
    id, update: {
      fullName, email, avatar, removeAvatar,
    },
  }, // {req, res}
  _context,
  _info,
) => {
  return AccountService.update(id, {
    fullName, email, avatar, removeAvatar,
  })
}

export default {
  Query: {
    accountMe,
  },
  Mutation: {
    accountSignup,
    accountLogin,
    accountUpdate,
  },
}
