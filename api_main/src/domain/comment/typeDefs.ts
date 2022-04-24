import { gql } from 'apollo-server'

export default gql`
  input CommentRepliesInput {
    request: Boolean!
    filter: CommentFilterQueryInput
  }

  input CommentCreateInput {
    content: String!
    task: ID!
    previous: ID
  }
  
  input CommentReplyCreateInput {
    content: String!
    previous: ID!
    task: ID
  }
  

  input CommentFilterQueryInput {
    task: ID
    createdBy: ID
    previous: String
  }

  input CommentRepliesQueryInput {
    limit: NonNegativeInt
  }
  
  type Comment {
    id: ID!
    content: String!
    task: Task!
    previous: ID
    createdBy: User!
    replyToUser: User
    createdAt: DateTime!
  }

  extend type Mutation {
    commentCreate(
      input: CommentCreateInput!
    ): Comment! @auth(requires: USER)

    commentReplyCreate(
      input: CommentReplyCreateInput!
    ): Comment! @auth(requires: USER)
   
    commentRemove( id: ID! ): ID! @auth(requires: USER)
  }
  

  extend type Query {
    commentCount(filter:CommentFilterQueryInput): NonNegativeInt @auth(requires: USER)
    commentGetList(filter:CommentFilterQueryInput, withReplies: CommentRepliesQueryInput): [Comment]! @auth(requires: USER)
    commentGetById(id: ID!): Comment @auth(requires: USER)
  }

`
