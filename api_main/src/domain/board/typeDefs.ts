import { gql } from 'apollo-server'

export default gql`
  type Board {
    id: ID!
    title: String!
    description: String!
    membersCount: NonNegativeInt!
    members: [User]!
    createdBy: User!
    createdAt: DateTime!
  }

  input BoardCreateInput {
    title: String!
  }

  input BoardUpdateInput {
    title: String
  }

  input BoardAddMemberInput {
    title: String
  }

  input BoardCountFilterInput {
    createdBy: String
  }

  input BoardListFilterInput {
    createdBy: String
  }

  extend type Mutation {
    boardCreate(
      input: BoardCreateInput!
    ): Board!  @auth(requires: USER)
    boardUpdate( 
      id: ID!,
      input: BoardUpdateInput!
    ): Board! @auth(requires: USER)
    boardRemove( id: ID! ): ID!  @auth(requires: USER)
  }
  

  extend type Query {
    boardCount(filter:BoardCountFilterInput): NonNegativeInt  @auth(requires: USER)
    boardGetList(filter:BoardListFilterInput): [Board]! @auth(requires: USER)
    boardGetById(id: ID!): Board @auth(requires: USER)
  }
`
