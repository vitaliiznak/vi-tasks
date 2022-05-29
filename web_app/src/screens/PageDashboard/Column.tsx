
import React, { useRef } from 'react'

import { css } from '@emotion/css'
import { DASHBOARD_TASK_COLUMNS } from '@src/appConstants'
import TaskCard from './TaskCard'
import { useDrop } from 'react-dnd'

const stylesColumn = css`
  display: flex;
  flex-direction: column;
  margin-top: 8;
  width: 320px;
  min-width: 320px;
  h2: {
    margin: 0;
    padding: 0 16px;
  }
`

const stylesList = css`
  padding-top:8px;
  padding-bottom: 4px;
  margin-top: 8;
  border-radius: 8;
  padding: 16;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  border: 1px dashed #717171;
  margin: 0 3px;
  height: calc(100vh - 118px);
  &>.cards_container{
    height: 100%;
    overflow-y: auto;
    margin: 0 5px;
    width: 300px;
    display:flex;
    flex-direction:column;  
  }
  `

const Column: React.FC<{
  col: {
    id: 'TODO' | 'IN_PROGRESS' | 'IN_REVIEW' | 'DONE';
    list: any[];
  },
  // eslint-disable-next-line @typescript-eslint/ban-types
  getTaskPosition: Function
  // eslint-disable-next-line @typescript-eslint/ban-types
  moveTask: Function
  // eslint-disable-next-line @typescript-eslint/ban-types
  clearTaskMovement: Function
  // eslint-disable-next-line @typescript-eslint/ban-types
  finishTaskMovement: Function

}> = ({ col: { list, id }, getTaskPosition, moveTask, clearTaskMovement, finishTaskMovement }) => {
  const ref = useRef(null)
  const [, connectDrop] = useDrop({
    accept: 'TASK',
    hover(draggedTask: any) {
      moveTask(draggedTask.id, { columnId: id, row: list.length })
    },
    drop: (draggedTask: any) => {
      finishTaskMovement(draggedTask.id, { columnId: id, row: list.length })
    }
  })
  connectDrop(ref)

  return (
    <div className={stylesColumn}>
      <h4>{DASHBOARD_TASK_COLUMNS[id].title}</h4>
      <div
        className={stylesList}>
        <div
          className="cards_container">
          {list.map((task, index) => (
            <TaskCard
              key={task.id}
              task={task}
              index={index}
              columnId={DASHBOARD_TASK_COLUMNS[id].id}
              getTaskPosition={getTaskPosition}
              moveTask={moveTask}
              finishTaskMovement={finishTaskMovement}
              clearTaskMovement={clearTaskMovement}
            />
          ))}
          <div
            ref={ref}
            className={css`
              min-height: 250px; 
              background: red; 
              flex: 1;`}>
          </div>
        </div>
      </div>
    </div>
  )
}
export default Column
