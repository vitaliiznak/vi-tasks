import {
  Card, Tag, Tooltip, Typography,
} from 'antd'
import { css } from '@emotion/css'
import { useDrag, useDrop } from 'react-dnd'
import { Link } from 'react-router-dom'
import { PRIORITY } from '@src/appConstants'
import UserCart from '@src/screens/components/CreatedByAssignedCard'
import { gSelectedBoard } from '@src/appState/appState'
import { useReactiveVar } from '@apollo/client'
import { useRef } from 'react'
import { Task } from '@src/queries/types'

const { Paragraph, Title } = Typography
const classStylesDragable = css`
    cursor: move; /* fallback if grab cursor is unsupported */
    cursor: grab;
    cursor: -moz-grab;
    cursor: -webkit-grab;
`

const TaskCard = ({
  task: {
    id,
    title,
    priority,
    createdBy,
    assigners,
    description,
    state,
    isDragging
  },
  getTaskPosition,
  moveTask,
  clearTaskMovement,
  finishTaskMovement
}: {
  index: number
  columnId: string
  task: Task & { isDragging?: boolean }
  // eslint-disable-next-line @typescript-eslint/ban-types
  getTaskPosition: Function
  // eslint-disable-next-line @typescript-eslint/ban-types
  moveTask: Function
  // eslint-disable-next-line @typescript-eslint/ban-types
  clearTaskMovement: Function
  // eslint-disable-next-line @typescript-eslint/ban-types
  finishTaskMovement: Function
}) => {
  const board = useReactiveVar(gSelectedBoard)
  const ref = useRef(null)
  const originalPosition = getTaskPosition(id)
  const [{ isDragging: isDraggingAux }, connectDrag] = useDrag(
    () => ({
      type: 'TASK',
      item: () => {
        return {
          id,
          title,
          priority,
          createdBy,
          assigners,
          description,
          state,
          originalPosition
        }
      },
      collect: (monitor) => ({
        isDragging: monitor.isDragging()
      }),
      end: (item, monitor) => {
        if (!monitor.didDrop()) {
          moveTask(item.id, item.originalPosition)
        }
        clearTaskMovement(item.id, item.originalPosition)
      }
    }),
    [id, originalPosition, getTaskPosition, moveTask]
  )

  const [, connectDrop] = useDrop(() => ({
    accept: 'TASK',
    hover: (draggedTask: any, monitor) => {
      if (monitor.isOver({ shallow: true }) && draggedTask.id !== id) {
        const draggedOverPosition = getTaskPosition(id)
        moveTask(draggedTask.id, draggedOverPosition)
      }
    },
    drop: (draggedTask: any) => {
      const draggedOverPosition = getTaskPosition(id)
      finishTaskMovement(draggedTask.id, draggedOverPosition)
    }
  }), [getTaskPosition, moveTask])

  const opacity = isDragging || isDraggingAux ? 0.5 : 1

  return (
    <div
      ref={node => connectDrag(connectDrop(node))} style={{ opacity }}
      className={classStylesDragable}
    >
      <Card className={css`margin: 8px 8px 8px 8px;position: relative;`}>
        <div
          className={css`
                display: flex; 
                justify-content: space-between;
                padding-top: 18px;
              `}
        >
          <div>
            <Tooltip title="open in new tab">
              <Link
                target="_blank"
                to={`/b/${board!.id}/tasks/${id}`}
              >
                <Title level={5}>{title}</Title>
              </Link>
            </Tooltip>
            <Tag color={PRIORITY[priority].color}>{priority}</Tag>
          </div>
          <div
            className={
              css`
                  width: 8px;`
            }
          />
          <div
            className={
              css`
                max-width: 94px;
                padding-right: 4px;`
            }
          >
            <h6>Report to:</h6>
            <UserCart {...createdBy} />
            <br />
            <h6>Assigners:</h6>
            {assigners.length === 0 && <div className={
              css`
                    border: 1px dashed rgba(91,91,91, 0.7);
                    width: 100%;
                    font-size: 10px; 
                  `
            }>no assigners</div>}
            {assigners.map(({
              fullName, email, id: idAssigner, avatar,
            }: any) => (
              <UserCart
                key={id}
                {...{
                  fullName,
                  email,
                  id: idAssigner,
                  avatar,
                }}
              />
            ))}
          </div>
        </div>

        <Paragraph ellipsis={{ rows: 3 }} copyable style={{
          whiteSpace: 'pre-line'
        }}>
          {description}
        </Paragraph>
      </Card>
    </div>
  )
}

export default TaskCard
