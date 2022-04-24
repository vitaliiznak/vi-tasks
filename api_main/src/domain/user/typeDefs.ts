import { gql } from 'apollo-server'

export default gql`
  type UserAvatar {
    pravatarId: String
    file: FileAttachment
  }

  type User {
    id: ID!
    fullName: String!
    email: EmailAddress!
    avatar: UserAvatar
  }


  extend type Query {
    userGetList: [User]!  @auth(requires: USER)
    userGetById(id: ID): User @auth(requires: USER)
  }

`
