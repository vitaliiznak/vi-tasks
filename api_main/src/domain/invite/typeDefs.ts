import { gql } from 'apollo-server'

export default gql`
  input InviteCreateInput {
    boardId: ID!
    description: String!
    expirationTime: Date
  }

  input InviteJoinBoardInput {
    id: ID!
    token: String!
  }

  input InviteListFilterInput {
    board: ID
    createdBy: String
    expirationTime: Date
    stateAnyOf: [String]
    state_NOTAnyOf: [String]
  }

  input InviteCountFilterInput {
    boardId: ID
    createdBy: String
    expirationTime: Date
  }

  type Invite {
    id: ID!
    account: ID
    board: Board!
    token: String!
    state: String!
    description: String!
    expirationTime: DateTime!
    createdBy: User!
    createdAt: DateTime!
  }

  extend type Query {
    inviteCount(filter:InviteCountFilterInput): NonNegativeInt  @auth(requires: USER)
    inviteGetList(filter:InviteListFilterInput): [Invite]! @auth(requires: USER)
    inviteGetById(id: ID!): Invite @auth(requires: USER)
    invitePublicGetById(id: ID!): Invite
  }

  extend type Mutation {
    inviteCreate(
      input: InviteCreateInput!
    ): Invite!  @auth(requires: USER)
    inviteInvalidate( token: String! ): ID!  @auth(requires: USER)
    inviteJoinBoard( 
      input: InviteJoinBoardInput!
    ): Invite
  }

`
