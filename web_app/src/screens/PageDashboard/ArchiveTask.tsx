import { css } from '@emotion/css'
import { useQuery, useReactiveVar } from '@apollo/client'
import { Link } from 'react-router-dom'
import { COUNT_TASKS } from '@src/queries'
import { gSelectedBoard } from '@src/appState/appState'
import { CountTasksQuery } from '@src/queries/types'

export default ({ isOver }: { isOver: boolean }) => {
  const board = useReactiveVar(gSelectedBoard)
  const { data } = useQuery<CountTasksQuery>(COUNT_TASKS, {
    variables:
    {
      filter:
        { isArchived: true }
    },
  })
  console.log('isOver', isOver)
  return (
    <div
      className={css`
        height: 100%;
        border: 2px ${isOver ? 'solid' : 'dashed'} orange ; 
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
  )
}
