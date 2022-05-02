import { gql } from 'apollo-server'

export default gql`
  input UserListFilterInput {
    boardId: ID 
  }

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
    userGetList(filter:UserListFilterInput): [User]!  @auth(requires: USER)
    userGetById(id: ID): User @auth(requires: USER)
  }

`
