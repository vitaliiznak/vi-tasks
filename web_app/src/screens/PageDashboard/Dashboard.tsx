import React, { memo, useEffect, useMemo, useState } from 'react'
import { DragDropContext, DropResult } from 'react-beautiful-dnd'
import { css } from '@emotion/css'
import { useMutation, useQuery, useReactiveVar } from '@apollo/client'
import {
  Button, Form, message, Modal, Result, Spin,
} from 'antd'
import TaskNew from '@src/screens/TaskNew'
import { DASHBOARD_TASK_COLUMNS } from '@src/appConstants'
import { ARCHIVE_TASK, CHANGE_STATE, GET_TASKS } from '@src/queries'
import TaskAddAssigneers from '@src/screens/TaskItem/TaskAddAssigneers'
import { GetBoardQuery, GetTasksQuery } from '@src/queries/types'
import { apolloReactClient } from '@src/App/App'
import ArchiveTask from './ArchiveTask'
import Column from './Column'
import Faker from '@src/scripts/Faker'
import { gSelectedBoard } from '@src/appState/appState'

const stylesColumns = css`
  margin-top: 3px;
  display: flex;
  overflow-x: auto;
  width: 100%;
  margin-bottom: 20px;
`

const groupTasksByState = (tasks: GetTasksQuery['tasks']) => tasks.reduce((accum: {
  [fieldName: string]: any
}, task) => ({
  ...accum,
  [task!.state]: {
    id: task!.state,
    list: [
      ...(accum[task!.state] && (accum[task!.state].list || [])),
      task,
    ],
  },
}), { ...DASHBOARD_TASK_COLUMNS })


const Dashboard = () => {
  const board = useReactiveVar(gSelectedBoard)
  const [showNewTaskModal, setNewTaskModal] = useState(false)
  const [isBoardPopulating, setIsBoardPopulating] = useState(false)
  const [assignTaskTaskModalParameters, setAssignTaskTaskModal] = useState<{ taskId: string, previousColumnsState?: any } | null>(null)
  const [columns, setColumns] = useState<null | { [key: string]: GetTasksQuery['tasks'] }>(null)

  const { loading: tasksLoading, data: tasksData, error: tasksError, refetch: tasksRefetch } = useQuery<GetTasksQuery>(GET_TASKS, {
    variables:
    {
      filter: {
        isArchived: false,
        board: board!.id
      },
    },
  })
  const [archiveTask] = useMutation(ARCHIVE_TASK)
  const [changeTaskState] = useMutation(CHANGE_STATE)

  const [form] = Form.useForm()
  const faker = useMemo(() => new Faker(apolloReactClient), [])

  useEffect(() => {
    if (!tasksData) return
    const { tasks } = tasksData
    const groupedTasks = groupTasksByState(tasks)
    setColumns(groupedTasks)
  }, [tasksData])

  if (!columns) return null

  const onFillWithFakeData = () => {
    setIsBoardPopulating(true)
    faker.populateForBoard(board!.id, { num: 8 }).then(() => {
      //window.location.reload()
      tasksRefetch()
    }).finally(() => {
      setIsBoardPopulating(false)
    })
    // window.location.reload()
  }

  const onCreated = () => {
    setNewTaskModal(false)
  }

  const onTaskNew = () => {
    setNewTaskModal(true)
  }

  const onDragEnd = async ({
    source, destination, draggableId
  }: DropResult) => {
    // Make sure we have a valid destination
    // Make sure we're actually moving the item
    if (
      destination === undefined
      || destination === null
      || !['TO_ARCHIVE', ...Object.keys(DASHBOARD_TASK_COLUMNS)].includes(destination.droppableId)
      || (source.droppableId === destination.droppableId
        && destination.index === source.index)
    ) {
      return
    }

    if (destination.droppableId === 'TO_ARCHIVE') {
      // archive item
      archiveTask({
        variables: {
          id: draggableId,
        },
        refetchQueries: ['GetTasks', 'CountTasks']
      }).then(() => {
        message.success('Task has been archived!')
      })
      return
    }

    // Set start and end variables
    const start = (columns as any)[source.droppableId]
    const end = (columns as any)[destination.droppableId]

    // const start = columns['todo']
    // const end = columns['todo']

    // If start is the same as end, we're in the same column
    if (start?.id === end?.id) {
      // Move the item within the list
      // Start by making a new list without the dragged item
      const newList = start.list.filter(
        (_: any, index: number) => index !== source.index,
      )
      // Then insert the item at the right location
      newList.splice(destination.index, 0, start.list[source.index])
      // Then create new copy of the column object
      const newCol = {
        id: start.id,
        list: newList,
      }
      // Update the state
      setColumns((state) => ({ ...(state || {}), [newCol.id]: newCol }))
      return
    }
    // If start is different from end, we need to update 2 columns
    // Filter the start list like before
    const newStartList = start.list.filter(
      (_: any, index: number) => index !== source.index,
    )

    // Create new start column
    const newStartCol = {
      id: start.id,
      list: newStartList,
    }
    // Make a new end list array
    const newEndList = [...end.list]
    // Insert the item into the end list
    newEndList.splice(destination.index, 0, start.list[source.index])
    // Create new end column
    const newEndCol = {
      id: end.id,
      list: newEndList,
    }
    setColumns((state: any) => ({
      ...state,
      [newStartCol.id]: newStartCol,
      [newEndCol.id]: newEndCol,
    }))

    changeTaskState({
      variables: {
        id: draggableId,
        state: end.id,
      }
    }).then(() => {
      message.success(`Task has been moved to ${end.id}!`)

      // if (destination.droppableId === DASHBOARD_TASK_COLUMNS.IN_PROGRESS.id
      //   && source.droppableId === DASHBOARD_TASK_COLUMNS.TODO.id) {
      //   setAssignTaskTaskModal({
      //     taskId: draggableId,
      //     previousColumnsState: columns
      //   })
      // }
    }).catch(err => {
      console.error(err)
      setColumns(columns)
    })

  }

  if (tasksLoading || !board) return <Spin />
  if (tasksError) {
    return (
      <Result
        status="warning"
        title="There are some problems with your operation."
        extra={(
          <a href="/">
            go to main page
          </a>
        )}
      />
    )
  }

  const { title: boardTitle } = board

  return (
    <>

      {showNewTaskModal && (
        <Modal
          maskClosable={false}
          onCancel={() => {
            setNewTaskModal(false)
          }}
          title="Create task"
          visible
          footer={null}
        >
          <TaskNew boardId={board!.id} form={form} onCreated={onCreated} footer={() => (
            <div className={css`display: flex; justify-content: space-between;`}>
              <Button
                type="primary"
                ghost
                onClick={() => {
                  setNewTaskModal(false)
                }}
              >
                Cancel
              </Button>
              <Button
                htmlType="submit"
                ghost
              >
                Create
              </Button>
            </div>
          )} />
        </Modal>
      )}
      <div
        className={css`
          width: calc(100vw - 238px);
          margin-top: 18px;
          padding-right: 10px;
          height: calc(100% - 70px);
        `}
      >
        <div className={
          css`
            display: flex;
            justify-content: space-between;
          `
        }
        >
          <div
            className={css`
              display: flex;
            `}>
            <div>
              <div>
                <h1
                  className={css`
                    display: inline-block;
                    margin-bottom: 0;
                  `}
                >
                  {boardTitle}
                  {' '}
                  |
                </h1>
                {' '}
                {tasksData?.tasks?.length}
                {' '}

                actived task(s)
              </div>

              <span
                className={css`
                margin-top: -20px;
              `}
              >
                Drag and drop task between columns
              </span>
            </div>
            {/* <Button
              danger
              size="large"
              className={css`margin-left: 8px; margin-top: 10px;`}
              onClick={onFillWithFakeData}
              loading={isBoardPopulating}>Populate board with fake data</Button> */}
          </div>
          <Button
            size="large"
            type="primary"
            ghost
            onClick={onTaskNew}
            className={css`
              margin-right: 30px;
            `}
          >
            New task
          </Button>
        </div>
        <div className={stylesColumns}>
          <DragDropContext onDragEnd={onDragEnd}>
            {Object.values(columns).map((col: any) => (
              <Column col={col} key={col.id} />
            ))}
            <ArchiveTask />
          </DragDropContext>
        </div>
        {Boolean(assignTaskTaskModalParameters) && (
          <Modal
            maskClosable={false}
            onCancel={() => {
              // setColumns(assignTaskTaskModalParameters?.previousColumnsState)
              setAssignTaskTaskModal(null)
            }}
            title="Do you want to change assigneers for this task?"
            visible
            footer={false}
          >
            <TaskAddAssigneers
              id={assignTaskTaskModalParameters!.taskId}
              onFinish={() => {
                setAssignTaskTaskModal(null)
              }}
            />
          </Modal>
        )}
      </div>
    </>
  )
}

export default Dashboard
