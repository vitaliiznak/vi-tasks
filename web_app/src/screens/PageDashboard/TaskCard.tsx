import React from 'react'
import {
  Card, Tag, Tooltip, Typography,
} from 'antd'
import { css } from '@emotion/css'
import { Draggable } from 'react-beautiful-dnd'
import { Link } from 'react-router-dom'
import { PRIORITY } from 'appConstants'
import UserCart from 'screens/components/CreatedByAssignedCard'
import { gSelectedBoard } from 'appState/appState'
import { useReactiveVar } from '@apollo/client'

const { Paragraph, Title } = Typography

const TaskCard = ({
  index,
  task: {
    id,
    title,
    priority,
    createdBy,
    assigners,
    description,
  },
}: {
  index: number
  task: {
    id: string
    title: string
    priority: string
    createdBy: any
    assigners: any[]
    description: string,
    isArchived: boolean
  }
}) => {
  const board = useReactiveVar(gSelectedBoard)
  return (
    <Draggable draggableId={id} index={index}>
      {(provided) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
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
      )}
    </Draggable >
  )
}

export default TaskCard
