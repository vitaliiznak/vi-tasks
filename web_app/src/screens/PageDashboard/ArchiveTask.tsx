import React from 'react'
import { Droppable } from 'react-beautiful-dnd'
import { css } from '@emotion/css'
import { useQuery, useReactiveVar } from '@apollo/client'
import { Link } from 'react-router-dom'
import { COUNT_TASKS } from '@src/queries'
import { gSelectedBoard } from '@src/appState/appState'
import { CountTasksQuery } from '@src/queries/types'

export default () => {
  const board = useReactiveVar(gSelectedBoard)
  const { data } = useQuery<CountTasksQuery>(COUNT_TASKS, {
    variables:
    {
      filter:
        { isArchived: true },
    },
  })
  return (
    <Droppable
      droppableId="TO_ARCHIVE"
      ignoreContainerClipping
    >
      {(provided) => (
        <div className={css`height: 250px;`}>
          <div
            {...provided.droppableProps}
            ref={provided.innerRef}
            className={css`
              height: 250px;
              border: 2px dashed orange; 
              width: 200px; 
              display: flex;
              flex-direction: column;
              justify-content:center;
              margin-top: 27px;
              margin-left: 10px;
              align-items:center;`}
          >
            Send to archive
            <br />
            <br />
            {data?.taskCount}
            {' '}
            archived tasks
            <Link
              type="primary"
              to={`/b/${board?.id}/tasks/archive`}
              className="ant-btn ant-btn-primary ant-btn-sm ant-btn-background-ghost"
            >
              Open archive

            </Link>
          </div>
        </div>
      )}
    </Droppable>
  )
}
