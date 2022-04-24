import { gql } from 'apollo-server'

export default gql`

  input AccountAvatarInput {
    pravatarId: String
    file: UploadWrapper
  }

  type AccountAvatar {
    pravatarId: String
    file: FileAttachment
  }


  type Account {
    id: ID!
    fullName: String!
    email: EmailAddress!
    avatar: AccountAvatar
    token: String
    createdAt: DateTime
  }

  input AccountSignupInput {
      fullName: String
      email: EmailAddress
      password: String
  }

  input AccountUpdateInput {
      fullName: String
      email: EmailAddress
      avatar: AccountAvatarInput
      removeAvatar: Boolean
  }

  extend type Query {

    accountMe: Account! @auth
  }


  extend type Mutation {
    accountLogin(email: EmailAddress!, password: String!): Account
    accountSignup(input: AccountSignupInput!): Account!
    accountUpdate(id: ID!, update: AccountUpdateInput!): Account! @auth
  }
`
