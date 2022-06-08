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
import { Task, GetTasksQuery } from '@src/queries/types'
import ArchiveTask from './ArchiveTask'
import Column from './Column'
import { gSelectedBoard } from '@src/appState/appState'
import { DropTargetMonitor, useDrop } from 'react-dnd'

type TTaskList = GetTasksQuery['tasks'] & { isDragging?: boolean }


const groupTasksByState = (tasks: TTaskList) => tasks.reduce((accum: any, task) => ({
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
      list: TTaskList
    }
  }>(null)

  const { loading: tasksLoading, data: tasksData, error: tasksError } = useQuery<GetTasksQuery>(GET_TASKS, {
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

  const [{ isOver }, connectDropArchive] = useDrop({
    accept: 'TASK',
    collect: (monitor: DropTargetMonitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop()
    }),
    drop: (draggedTask: Task) => {
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
    }
  }
  )


  const onCreated = useCallback(() => {
    setNewTaskModal(false)
  }, [])

  const onTaskNew = useCallback(() => {
    setNewTaskModal(true)
  }, [])


  const clearTaskMovement = useCallback(() => {
    for (const { id: columnId, list } of Object.values(columns!)) {
      columns![columnId].list = columns![columnId].list.map((el: any) => {
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
      }).catch(err => {
        console.error(err)
      })
  }, [])

  const moveTask = useCallback((id: string, to: any) => {

    const from = getTaskPosition(id)!
    if (from.columnId === to.columnId) {

      const { list: columnFrom } = columns![from.columnId]
      if (to.row > from.row) {
        columns![to.columnId].list = [
          ...columnFrom.slice(0, from.row),
          ...columnFrom.slice(from.row + 1, to.row),
          { ...columnFrom[from.row], isDragging: true },
          ...columnFrom.slice(to.row, columnFrom.length)
        ] as TTaskList
      } else {
        columns![to.columnId].list = [
          ...columnFrom.slice(0, to.row),
          { ...columnFrom[from.row], isDragging: true },

          ...columnFrom.slice(to.row, from.row),
          ...columnFrom.slice(from.row + 1, columnFrom.length)
        ] as TTaskList

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
      ] as TTaskList
    }
    setColumns({ ...columns })
  }, [columns])


  if (!columns) return null
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
              font-weight: 900;
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
            <ArchiveTask isOver={isOver} />
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
