import { gql } from 'apollo-server'

export default gql`
  enum TaskStateEnum {
    TODO,
    IN_PROGRESS,
    IN_REVIEW,
    DONE
  }
  
  enum TaskPriorityEnum {
    LOW
    MEDIUM
    HIGH,
    CRITICAL
  }
  
  input TaskListFilterInput {
    assignersAnyOf: [ID]
    createdByAnyOf: [ID]
    prioritiesAnyOf: [TaskPriorityEnum]
    searchTitle: String
    searchDescription: String
    isArchived: Boolean
    board: ID
  }

  input TaskCountFilterInput {
    assignersAnyOf: [ID]
    createdByAnyOf: [ID]
    prioritiesAnyOf: [TaskPriorityEnum]
    searchTitle: String
    searchDescription: String
    isArchived: Boolean
  }

  type Task {
    id: ID!
    title: String!
    description: String!
    priority: TaskPriorityEnum!
    state: TaskStateEnum!,
    attachments: [FileAttachment]!
    assigners: [User]!
    createdBy: User!
    isArchived: Boolean!
    createdAt: DateTime!
  }

  input TaskCreateInput {
    board: ID!
    title: String!
    priority: TaskPriorityEnum!
    description: String
    state: TaskStateEnum
    attachments: [UploadWrapper]!
    assigners: [ID]

  }

  input TaskUpdateInput {
    title: String, 
    description: String,
    priority: TaskPriorityEnum
    assignersAdd: [ID]
    assignersRemove: [ID]
  }
 
  extend type Mutation {
    taskCreate(
      input: TaskCreateInput!
    ): Task! @auth(requires: USER)
    taskUpdate( 
      id: ID!,
      input: TaskUpdateInput!
    ): Task! @auth(requires: USER)
    taskRemove( id: ID! ): ID!  @auth(requires: USER)

    taskArchive( id: ID! ): Task!  @auth(requires: USER)
    taskUnarchive( id: ID! ): Task!  @auth(requires: USER)
    taskChangeState( id: ID!, state: String! ): Task!  @auth(requires: USER)
  }
  

  extend type Query {
    taskCount(filter:TaskCountFilterInput): NonNegativeInt @auth(requires: USER)
    taskGetList(filter:TaskListFilterInput): [Task]! @auth(requires: USER)
    taskGetById(id: ID!): Task @auth(requires: USER)
  }

`
