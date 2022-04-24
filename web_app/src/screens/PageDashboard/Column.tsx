
import React from 'react'
import { Droppable } from 'react-beautiful-dnd'
import { css } from '@emotion/css'
import { DASHBOARD_TASK_COLUMNS } from 'appConstants'
import TaskCard from './TaskCard'

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
  }
  `

const Column: React.FC<{
  col: {
    id: string;
    list: any[];
  };
}> = ({ col: { list, id } }) => (
  <div className={stylesColumn}>
    <h4>{(DASHBOARD_TASK_COLUMNS as any)[id].title}</h4>
    <Droppable
      droppableId={id}
      ignoreContainerClipping
    >
      {(provided) => (
        <div className={stylesList} {...provided.droppableProps} ref={provided.innerRef}>
          <div className="cards_container">
            {list.map((task, index) => (
              <TaskCard
                key={task.id}
                task={task}
                index={index}
              />
            ))}
            <div className={css`min-height: 250px;`}>
              {provided.placeholder}
            </div>
          </div>
        </div>
      )}
    </Droppable>
  </div>

)

export default Column
