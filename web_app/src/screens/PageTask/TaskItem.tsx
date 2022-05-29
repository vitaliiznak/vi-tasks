

import { Card } from 'antd'
import { useParams } from 'react-router-dom'
import TaskItem from '@src/screens/TaskItem'
import { css } from '@emotion/css'

export default () => {
  const { id } = useParams<{ id: string }>()
  return (
    <Card className={css`max-width: 1200px;`}>
      <TaskItem id={id!} />
    </Card>
  )
}
