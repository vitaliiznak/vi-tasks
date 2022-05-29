
import { ApolloClient, NormalizedCacheObject } from '@apollo/client'
import { CREATE_BOARD, CREATE_COMMENT, CREATE_REPLY_COMMENT, CREATE_TASK, LOGIN, SIGN_UP } from '@src/queries'

import { AUTH_TOKEN_LOCALSTORAGE_KEY } from '@src/appConstants'

import * as falso from '@ngneat/falso'
import { CreateBoardMutation, CreateCommentMutation, CreateReplyCommentMutation, CreateTaskMutation, SignUpMutation, TaskStateEnum } from '@src/queries/types'
import { TaskPriorityEnum } from '@src/types/graphql-global-types'
/**
 * Reuse this code for integration tests
 */
const isStringANumber = (value: any) => isNaN(Number(value)) === false

function EnumToArray(enumme: any) {
  return Object.values(enumme)
}

function getRandomInt(max = 1) {
  return Math.floor(Math.random() * max)
}

const taskPriorityArray = EnumToArray(TaskPriorityEnum)

const taskStateArray = EnumToArray(TaskStateEnum)

class Faker {
  static defaultUserCredentials = {
    email: 'john@mail.com',
    password: '12345'
  }


  client: ApolloClient<NormalizedCacheObject>
  constructor(client: ApolloClient<NormalizedCacheObject>) {
    this.client = client
  }


  public createBoard = () => {
    return this.client.mutate<CreateBoardMutation>({
      mutation: CREATE_BOARD,
      variables: {
        input: {
          title: falso.randTodo().title
        }
      },
    })
  }

  public createTasks = (boardId: string, options?: {
    num?: number
    max?: number
  }) => {
    const num = options?.max ? getRandomInt(options?.max) : options?.num || 1
    return [...Array(num).keys()].map(() => this.client.mutate<CreateTaskMutation>({
      mutation: CREATE_TASK,
      variables: {
        input: {
          board: boardId,
          title: falso.randTodo().title,
          description: falso.randProductDescription(),
          priority: taskPriorityArray[getRandomInt(taskPriorityArray.length)],
          state: taskStateArray[getRandomInt(taskStateArray.length)],
          attachments: [],
          assigners: []
        }
      },
    }).catch(res => {
      console.error(JSON.stringify(res, null, 2))
    }))
  }

  public createComments = (taskIds: string[], options?: {
    num?: number
    max?: number
    repliesNum?: number
    repliesMax?: number
  }) => {
    const num = options?.max ? getRandomInt(options?.max) : (options?.num || 1)
    const repliesNum = options?.repliesMax ? getRandomInt(options?.repliesMax) : options?.repliesNum || 0

    return taskIds.map(taskId => [...Array(num).keys()].map(async () => {
      const resCommentCreate = await this.client.mutate<CreateCommentMutation>({
        mutation: CREATE_COMMENT,
        variables: {
          input: {
            content: falso.randProductDescription(),
            task: taskId
          }
        }
      }).catch(err => {
        console.error(err)
      })
      const resCreateReplyComments: any[] = []
      for (let i = 0; i < repliesNum; i++) {
        const resCreateReplyComment = await this.client.mutate<CreateReplyCommentMutation>({
          mutation: CREATE_REPLY_COMMENT,
          variables: {
            input: {
              previous: resCommentCreate!.data!.commentCreate!.id,
              task: taskId,
              content: falso.randProductDescription(),
            }
          }
        }).catch(err => {
          console.error(err)
        })
        resCreateReplyComments.push(resCreateReplyComment)
      }
      return [resCommentCreate, ...resCreateReplyComments]
    })).flat(10)
  }

  public populateForBoard = async (boardId: string, options?: {
    num: number
    max?: number
  }) => {
    const num = options?.num || 1
    const tasksRes = await Promise.all(this.createTasks(boardId, { num }))
    const taskIds = tasksRes.map(el => el!.data!.taskCreate!.id)
    const commentsRes = await Promise.all(this.createComments(taskIds, { max: 8, repliesMax: 4 }))
    return {
      tasksRes,
      commentsRes
    }
  }

  public populateUsers = async (opts: { num?: number } = {}
  ) => {
    /*
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
    ` */
    const num = opts.num || 1

    const firstName = falso.randLastName({ withAccents: false })
    const lastName = falso.randFullName({ withAccents: false })
    const credentials: Array<SignUpMutation['accountSignup']> = []
    for (let i = 0; i < num; i++) {
      const resSignup = await this.client.mutate<SignUpMutation>({
        mutation: SIGN_UP,
        variables: {
          input: {
            email: falso.randEmail({
              firstName,
              nameSeparator: '.'
            }),

            fullName: `${firstName} ${lastName}`,
            password: '12345'
          }
        }
      }).catch(err => {
        console.error(err)
      })
      credentials.push(resSignup!.data!.accountSignup)
    }

    // create invites


    //create user


    //join board


  }

  public populate = async ({ doLogin = false }) => {
    if (doLogin) {
      const resLogin = await this.client.mutate({
        mutation: LOGIN,
        variables: { email: Faker.defaultUserCredentials.email, password: Faker.defaultUserCredentials.password },
      })
      if (resLogin.data?.accountLogin?.token?.length) {
        localStorage.setItem(
          AUTH_TOKEN_LOCALSTORAGE_KEY,
          resLogin.data.accountLogin.token,
        )
      }
    }

    const resCreateBoard = await this.createBoard()
    const resCreateTasks = this.createTasks(resCreateBoard.data!.board!.id)


  }
}

export default Faker