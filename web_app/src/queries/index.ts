
import { gql } from '@apollo/client'

export const LOGIN = gql`
  mutation Login(
    $email:EmailAddress!, 
    $password:String!
    ) {
    accountLogin(email: $email, password:$password  ) {
      id,
      email,
      fullName,
      token
    }
  }
`
export const SIGN_UP = gql`
  mutation SignUp(
      $input: AccountSignupInput!
    ) {
    accountSignup(input: $input) {
      id,
      email,
      fullName,
      token
    }
  }
`

export const GET_ME = gql`
  query AccountMe {
    accountMe {
      id
      fullName
      email
      avatar {
        file {
          uri
          filename
          mimetype
          encoding
          ext
        }
      }
    }
  }
`


export const CREATE_BOARD = gql`
  mutation CreateBoard($input: BoardCreateInput!) {
    board: boardCreate(input: $input) {
      id
    }
  }
`

export const REMOVE_BOARD = gql`
  mutation RemoveBoard($id: ID!) {
    boardRemove(id: $id)
  }
`


export const GET_BOARD = gql`
  query GetBoard($id: ID!) {
      board: boardGetById(id: $id) {
        id
        title
        description
        createdAt
        createdBy {
          id,
          fullName,
          email,
          avatar {
            file {
              uri
              filename
              mimetype
              encoding
              ext
            }
          }
        }
      }
  }
`

export const GET_BOARDS = gql`
  query GetBoards($filter: BoardListFilterInput) {
    boards: boardGetList(filter: $filter) {
      id
      title
      description
      createdAt
      createdBy {
        id,
        fullName,
        email,
        avatar {
          file {
              uri
              filename
              mimetype
              encoding
              ext
            }
        }
      }
    }
  }
`

export const GET_TASK = gql`
  query GetTask($id: ID!) {
    taskGetById(id: $id) {
      id
      title
      description
      priority
      state
      isArchived
      createdBy {
        id
        fullName
        email
        avatar {
          file {
              uri
              filename
              mimetype
              encoding
              ext
            }
        }
      }
      createdAt
      assigners {
        id
        fullName
        email
      }
      attachments {
        uri
        filename
        mimetype
        encoding
        ext
      },
    }
  }
`

export const GET_TASKS = gql`
  query GetTasks($filter: TaskListFilterInput) {
    tasks: taskGetList(filter: $filter) {
      id
      title
      description
      priority
      state
      isArchived
      createdAt
      createdBy {
        id,
        fullName,
        email,
        avatar {
          file {
            uri
          }
        }
      }
      assigners {
        id
        fullName
        email
      }
      attachments {
        uri
        filename
        mimetype
        encoding
        ext
      } 
    }
  }
`

export const UNARCHIVE_TASK = gql`
  mutation UnarchiveTask($id: ID!) {
    taskUnarchive(id: $id) {
      id
    }
  }
`

export const ARCHIVE_TASK = gql`
  mutation ArchiveTask($id: ID!) {
    taskArchive(id: $id) {
      id
    }
  }
`

export const CREATE_TASK = gql`
  mutation CreateTask($input: TaskCreateInput!) {
    taskCreate(input: $input) {
      id
    } 
  }
`

export const UPDATE_TASK = gql`
  mutation UpdateTask($id: ID!, $input: TaskUpdateInput!) {
    taskUpdate(id: $id, input: $input) {
      id
      title
      description
      priority
      state
      isArchived
      createdBy {
        id
        fullName
        email
        avatar {
          file {
            uri
          }
        }
      }
      assigners {
        id
        fullName
        email
      }
      attachments {
        uri
        filename
        mimetype
        encoding
        ext
      },
    }
  }
`


export const COUNT_TASKS = gql`
  query CountTasks($filter: TaskCountFilterInput) {
    taskCount(filter: $filter)
  }
`


export const GET_USERS = gql`
  query GetUsers {
    userGetList {
      id
      fullName
      email
      avatar {
        file {
          uri
        }
      }
    }
  }
`

export const GET_USER = gql`
  query GetUser($id: ID!) {
    userGetById(id: $id) {
      id
      email
      fullName
      avatar {
        file {
          uri
        }
      }
    }
  }
`

export const GET_COMMENTS = gql`
  query GetComments($filter: CommentFilterQueryInput, $withReplies: CommentRepliesQueryInput) {
    commentGetList(filter: $filter, withReplies: $withReplies) {
      id
      content
      createdBy {
        id,
        fullName
        avatar {
          file {
            uri
          }
        }
      }
      createdAt
      previous
    }
  }
`


export const CREATE_COMMENT = gql`
  mutation CreateComment($input: CommentCreateInput!) {
    commentCreate(input: $input) {
      id
    } 
  }
`
export const CREATE_REPLY_COMMENT = gql`
  mutation CreateReplyComment($input: CommentReplyCreateInput!) {
    commentReplyCreate(input: $input) {
      id
    } 
  }
`


export const UPDATE_ACCOUNT = gql`
  mutation AccountUpdate($id: ID!, $update: AccountUpdateInput!) {
    accountUpdate(id: $id, update: $update) {
      id
      fullName
      email
      avatar {
        file {
          uri
          filename
          mimetype
          encoding
          ext
        }
      }
    }
  }
`

export const CHANGE_STATE = gql`
  mutation ChangeTaskState($id: ID!, $state: String!) {
    taskChangeState(id: $id, state: $state) {
      id
    }
  }
`

export const REMOVE_TASK = gql`
  mutation RemoveTasks($id: ID!) {
    taskRemove(id: $id)
  }
`


export const CREATE_INVITE = gql`
  mutation CreateInvite($input: InviteCreateInput!) {
    inviteCreate(input: $input) {
      id
      board {
        id
        title
      }
      token
      state
      expirationTime
      description
      createdBy {
          id
          fullName
          email
          avatar {
            file {
              uri
              filename
              mimetype
              encoding
              ext
            }
          }
        }
      createdAt
    }
  }
`

export const GET_INVITES = gql`
  query GetInvites ($filter: InviteListFilterInput) {
    inviteGetList(filter: $filter) {
      id
      board {
        id
        title
      }
      token
      state
      expirationTime
      description
      createdAt
      createdBy {
          id
          fullName
          email
          avatar {
            file {
              uri
              filename
              mimetype
              encoding
              ext
            }
          }
        }
      createdAt
    }
  }
`


export const GET_INVITE_BY_ID = gql`
  query GetInviteByID ($id: ID!) {
    inviteGetById(id: $id) {
      id
      board {
        id
        title
      }
      token
      state
      expirationTime
      description
      createdBy {
          id
          fullName
          email
          avatar {
            file {
              uri
              filename
              mimetype
              encoding
              ext
            }
          }
        }
      createdAt
    }
  }
`

export const GET_INVITE_PUBLIC_BY_ID = gql`
  query GetInvitePublicById ($id: ID!) {
    invitePublicGetById(id: $id) {
      id
      board {
        id
        title
      }
      token
      state
      expirationTime
      description
      createdBy {
          id
          fullName
          email
          avatar {
            file {
              uri
              filename
              mimetype
              encoding
              ext
            }
          }
        }
      createdAt
    }
  }
`


export const JOIN_BOARD = gql`
  mutation InviteJoinBoard($input: InviteJoinBoardInput!) {
    inviteJoinBoard(input: $input) {
      id
      board {
        id
        title
      }
      token
      state
      expirationTime
      description
      createdBy {
          id
          fullName
          email
          avatar {
            file {
              uri
              filename
              mimetype
              encoding
              ext
            }
          }
        }
      createdAt
    }
  }
`
