import { useCallback, useEffect, useState } from 'react'
import { css } from '@emotion/css'
import { useMutation, useQuery, useReactiveVar } from '@apollo/client'
import {
  Button, Form, message, Modal, Result, Spin,
} from 'antd'
import TaskNew from '@src/screens/TaskNew'
import { DASHBOARD_TASK_COLUMNS } from '@src/appConstants'
import { ARCHIVE_TASK, CHANGE_STATE, GET_TASKS } from '@src/queries'
import TaskAddAssigneers from '@src/screens/TaskItem/TaskAddAssigneers'
import { GetTasksQuery } from '@src/queries/types'
import ArchiveTask from './ArchiveTask'
import Column from './Column'
import { gSelectedBoard } from '@src/appState/appState'
import { useDrop } from 'react-dnd'

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
  const [assignTaskTaskModalParameters, setAssignTaskTaskModal] = useState<{ taskId: string, previousColumnsState?: any } | null>(null)
  const [columns, setColumns] = useState<null | {
    [key: string]: {
      id: string
      list: Array<GetTasksQuery['tasks'][number] & { isDragging?: boolean }>
    }
  }>(null)

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

  useEffect(() => {
    if (!tasksData) return
    const { tasks } = tasksData
    const groupedTasks = groupTasksByState(tasks)
    setColumns(groupedTasks)
  }, [tasksData])

  const [, connectDropArchive] = useDrop({
    accept: 'TASK',
    drop: (draggedTask: any) => {
      const from = getTaskPosition(draggedTask.id)!
      const { list: columnFrom } = columns![from.columnId]
      columns![from.columnId].list = [
        ...columnFrom.slice(0, from.row),
        ...columnFrom.slice(from.row + 1, columnFrom.length)
      ]
      archiveTask({
        variables: {
          id: draggedTask.id
        },
        refetchQueries: ['CountTasks']
      }).then(() => {
        message.success('Task has been archived!')
      })
      setColumns({ ...columns })
      // const draggedOverPosition = getTaskPosition(id)
      // finishTaskMovement(draggedTask.id, draggedOverPosition)
    }
  })


  const onCreated = useCallback(() => {
    setNewTaskModal(false)
  }, [])

  const onTaskNew = useCallback(() => {
    setNewTaskModal(true)
  }, [])


  const clearTaskMovement = useCallback(() => {

    for (const { id: columnId, list } of Object.values(columns!)) {
      columns![columnId].list = columns![columnId].list.map(el => {
        const { isDragging: _isDragging, ...rest } = el
        return rest
      })
    }

    setColumns({ ...columns })
  }, [columns])

  const getTaskPosition = useCallback((idToFind: string) => {
    for (const { id: columnId, list } of Object.values(columns!)) {
      for (let i = 0; i < list.length; i++) {
        const task = list[i]!
        if (task.id === idToFind) {
          return { columnId, row: i }
        }
      }
    }
    return null
  }, [columns])

  const finishTaskMovement = useCallback((id: string, to: {
    row: number
    columnId: string
  }) => {
    changeTaskState({
      variables: {
        id: id,
        state: to.columnId,
      }
    })
      .then(() => {
        message.success(`Task has been moved to ${to.columnId}!`)

        // if (destination.droppableId === DASHBOARD_TASK_COLUMNS.IN_PROGRESS.id
        //   && source.droppableId === DASHBOARD_TASK_COLUMNS.TODO.id) {
        //   setAssignTaskTaskModal({
        //     taskId: draggableId,
        //     previousColumnsState: columns
        //   })
        // }
      }).catch(err => {
        console.error(err)
      })
  }, [])

  const moveTask = useCallback((id: any, to: any) => {

    const from = getTaskPosition(id)!
    if (from.columnId === to.columnId) {

      const { list: columnFrom } = columns![from.columnId]
      if (to.row > from.row) {
        columns![to.columnId].list = [
          ...columnFrom.slice(0, from.row),
          ...columnFrom.slice(from.row + 1, to.row),
          { ...columnFrom[from.row], isDragging: true },
          ...columnFrom.slice(to.row, columnFrom.length)
        ]
      } else {
        columns![to.columnId].list = [
          ...columnFrom.slice(0, to.row),
          { ...columnFrom[from.row], isDragging: true },

          ...columnFrom.slice(to.row, from.row),
          ...columnFrom.slice(from.row + 1, columnFrom.length)
        ]

      }
    } else {
      const { list: columnFrom } = columns![from.columnId]
      const { list: columnTo } = columns![to.columnId]
      columns![from.columnId].list = [
        ...columnFrom.slice(0, from.row),
        ...columnFrom.slice(from.row + 1, columnFrom.length)
      ]
      columns![to.columnId].list = [
        ...columnTo.slice(0, to.row),
        { ...columnFrom[from.row], isDragging: true },
        ...columnTo.slice(to.row, columnTo.length)
      ]
    }
    setColumns({ ...columns })
  }, [columns])


  if (!columns) return null
  // const onDragEnd = async ({
  //   source, destination, draggableId
  // }:) => {
  //   // Make sure we have a valid destination
  //   // Make sure we're actually moving the item
  //   if (
  //     destination === undefined
  //     || destination === null
  //     || !['TO_ARCHIVE', ...Object.keys(DASHBOARD_TASK_COLUMNS)].includes(destination.droppableId)
  //     || (source.droppableId === destination.droppableId
  //       && destination.index === source.index)
  //   ) {
  //     return
  //   }

  //   if (destination.droppableId === 'TO_ARCHIVE') {
  //     // archive item
  //     archiveTask({
  //       variables: {
  //         id: draggableId,
  //       },
  //       refetchQueries: ['GetTasks', 'CountTasks']
  //     }).then(() => {
  //       message.success('Task has been archived!')
  //     })
  //     return
  //   }

  //   // Set start and end variables
  //   const start = (columns as any)[source.droppableId]
  //   const end = (columns as any)[destination.droppableId]

  //   // const start = columns['todo']
  //   // const end = columns['todo']

  //   // If start is the same as end, we're in the same column
  //   if (start?.id === end?.id) {
  //     // Move the item within the list
  //     // Start by making a new list without the dragged item
  //     const newList = start.list.filter(
  //       (_: any, index: number) => index !== source.index,
  //     )
  //     // Then insert the item at the right location
  //     newList.splice(destination.index, 0, start.list[source.index])
  //     // Then create new copy of the column object
  //     const newCol = {
  //       id: start.id,
  //       list: newList,
  //     }
  //     // Update the state
  //     setColumns((state) => ({ ...(state || {}), [newCol.id]: newCol }))
  //     return
  //   }
  //   // If start is different from end, we need to update 2 columns
  //   // Filter the start list like before
  //   const newStartList = start.list.filter(
  //     (_: any, index: number) => index !== source.index,
  //   )

  //   // Create new start column
  //   const newStartCol = {
  //     id: start.id,
  //     list: newStartList,
  //   }
  //   // Make a new end list array
  //   const newEndList = [...end.list]
  //   // Insert the item into the end list
  //   newEndList.splice(destination.index, 0, start.list[source.index])
  //   // Create new end column
  //   const newEndCol = {
  //     id: end.id,
  //     list: newEndList,
  //   }
  //   setColumns((state: any) => ({
  //     ...state,
  //     [newStartCol.id]: newStartCol,
  //     [newEndCol.id]: newEndCol,
  //   }))

  //   changeTaskState({
  //     variables: {
  //       id: draggableId,
  //       state: end.id,
  //     }
  //   }).then(() => {
  //     message.success(`Task has been moved to ${end.id}!`)

  //     // if (destination.droppableId === DASHBOARD_TASK_COLUMNS.IN_PROGRESS.id
  //     //   && source.droppableId === DASHBOARD_TASK_COLUMNS.TODO.id) {
  //     //   setAssignTaskTaskModal({
  //     //     taskId: draggableId,
  //     //     previousColumnsState: columns
  //     //   })
  //     // }
  //   }).catch(err => {
  //     console.error(err)
  //     setColumns(columns)
  //   })

  // }

  // if (tasksLoading || !board) return <Spin />
  // if (tasksError) {
  //   return (
  //     <Result
  //       status="warning"
  //       title="There are some problems with your operation."
  //       extra={(
  //         <a href="/">
  //           go to main page
  //         </a>
  //       )}
  //     />
  //   )
  // }


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
        <div
          className={css`
            display: flex;
            justify-content: space-between;
          `}>
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

        <div className={
          css`
                margin-top: 3px;
                display: flex;
                overflow-x: auto;
                width: 100%;
                margin-bottom: 20px;`} >
          <div
            className={
              css`
                display: flex;`}>
            {Object.values(columns).map((col: any) => (
              <Column col={col} key={col.id}
                getTaskPosition={getTaskPosition}
                moveTask={moveTask}
                finishTaskMovement={finishTaskMovement}
                clearTaskMovement={clearTaskMovement} />
            ))}
          </div>
          <div className={css`height: calc(100vh - 120px);`} ref={node => connectDropArchive(node)} >
            <ArchiveTask />
          </div>
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
