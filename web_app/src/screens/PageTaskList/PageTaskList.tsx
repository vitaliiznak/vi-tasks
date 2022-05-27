import React, { useState } from 'react'
import { css } from '@emotion/css'
import { gSelectedBoard } from '@src/appState/appState'
import TaskList from '../TaskList'
import TaskNew from '../TaskNew'
import Filter from '../TaskList/Filter'

const styleDisplayNone = css`display: none;`

type FilterProperties = React.ComponentProps<typeof Filter>
export default () => {
  const [filter, setFilter] = useState({})
  const onFilter: FilterProperties['onFilter'] = (values) => {
    setFilter({ ...values })
  }

  return (
    <TaskList
      className={
        css`
          max-width: 800px;
        `
      }
      title={
        (
          <>
            <h3>Archived tasks</h3>
            <Filter onFilter={onFilter} />
          </>
        )
      }
      filter={{ ...filter, isArchived: true }}
    />
  )
}
