import React, { useState } from 'react'
import {
  Button, Card, message, Modal, Result, Spin, Tag, Tooltip, Typography,
} from 'antd'
import { css } from '@emotion/css'
import { useMutation, useQuery, useReactiveVar } from '@apollo/client'
import { PRIORITY } from '@src/appConstants'
import { ARCHIVE_TASK, GET_TASK, UNARCHIVE_TASK } from '@src/queries'
import { EditOutlined, ExclamationCircleOutlined } from '@ant-design/icons'
import moment from 'moment'
import { Link } from 'react-router-dom'

import UserCart from '@src/screens/components/CreatedByAssignedCard'
import TaskAddAssigneers from './TaskAddAssigneers'
import Comments from './Comments'
import { GetTaskQuery } from '@src/queries/types'
import { gSelectedBoard } from '@src/appState/appState'

const { confirm } = Modal

const { Paragraph, Title } = Typography
const TaskItem = ({ id }: { id: string }) => {
  const board = useReactiveVar(gSelectedBoard)
  const { loading: loadingTask, error: errorTask, data: dataTask } = useQuery<GetTaskQuery>(GET_TASK, { variables: { id } })
  const [assignTaskTaskModalParameters, setAssignTaskTaskModal] = useState<{ taskId: string } | null>(null)

  const [unarchiveTask] = useMutation(UNARCHIVE_TASK)
  const [archiveTask] = useMutation(ARCHIVE_TASK)

  const onUnarchiveTask = () => {
    unarchiveTask({
      variables: {
        id,
      },
      refetchQueries: ['GetTasks', 'GetTask'],
    })
      .then(() => {
        message.success('Task has been unarchived!')
      })
  }

  const onArchiveTask = () => {
    confirm({
      title: 'Do you want to archive this task?',
      icon: <ExclamationCircleOutlined />,
      content: '',
      okText: 'Yes',
      onOk() {
        archiveTask({
          variables: {
            id,
          },
          refetchQueries: ['GetTasks', 'GetTask', 'CountTasks'],
        })
          .then(() => {
            message.success('Task has been unarchived!')
          })
      },
    })
  }

  const onFinishAssigment = () => {
    setAssignTaskTaskModal(null)
    message.success('Assigment changed')
  }

  const onChangeAssigners = () => {
    setAssignTaskTaskModal({ taskId: id })
  }

  if (loadingTask) return <Spin size="large" />
  if (errorTask) {
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

  const task = dataTask!.taskGetById
  if (!task) {
    return (
      <Result
        status="warning"
        title="No such tasks or you have not access to see it"
        extra={
          <a href="/">go to main page</a>
        }
      />
    )
  }

  const {
    title,
    description,
    priority,
    assigners,
    createdBy,
    isArchived,
    createdAt,
  } = dataTask!.taskGetById!

  return (
    <>
      {Boolean(assignTaskTaskModalParameters) && (
        <Modal
          maskClosable={false}
          onCancel={() => {
            setAssignTaskTaskModal(null)
          }}
          title={dataTask?.taskGetById?.title}
          visible
          footer={false}
        >
          <TaskAddAssigneers
            id={id}
            onFinish={onFinishAssigment}
          />
        </Modal>
      )}

      <Card className={css`padding: 10px 10px;`}>
        <div className={css`display: flex; justify-content: space-between;`}>
          <div>
            <Title level={3}>{title}</Title>
            <Tag color={PRIORITY[priority].color}>{priority}</Tag>
          </div>
          <div>
            <h6>Report to:</h6>
            <UserCart {...{
              fullName: createdBy.fullName,
              email: createdBy.email as string,
              id: createdBy.id,
              avatar: createdBy.avatar as any,
            }}
            />
            <br />
            <h6>
              Assigners:
              {isArchived
                ? (
                  <Tooltip title="You can not change assigners for archived task" className={css`margin-left: 8px;`}>
                    <Button disabled ghost icon={<EditOutlined />} size="small" />
                  </Tooltip>
                )
                : (
                  <Tooltip title="Change assigners" className={css`margin-left: 8px;`}>
                    <Button onClick={onChangeAssigners} ghost type="primary" icon={<EditOutlined />} size="small" />
                  </Tooltip>
                )}
            </h6>
            {assigners.length === 0 && <span>no assigners</span>}
            {assigners.map(({
              fullName, email, id: idArgument, avatar,
            }: any) => (
              <UserCart
                key={id}
                {...{
                  fullName, email, id: idArgument, avatar,
                }}
              />
            ))}
          </div>
        </div>
        <Paragraph ellipsis={{ rows: 3, expandable: true }} copyable style={{
          whiteSpace: 'pre-line'
        }}>
          {description}
        </Paragraph>
        {Boolean(task.attachments.length) && (
          <>
            <div className={css`font-size: 12px; color: rgba(240,240,240, 0.7);`}>Attachments:</div>
            <ul>
              {task.attachments.map(attachment => {
                return <li><a className={css`font-size: 10px;`} target="_blank" href={`${import.meta.env.VITE_APP_STORAGE_URI}/${attachment?.uri}`}>{attachment?.filename}</a></li>
              })}
            </ul>
          </>
        )
        }
        <div
          className={
            css`
              display: flex;
            `
          }
        >
          <small>
            Created
            {' '}
            {moment(createdAt).fromNow()}
            <br />
            by
            {' '}
            <Link to={`b/${board!.id}/members/${id}`}>
              {' '}
              {`${createdBy.fullName} - ${createdBy.email}`}
              {' '}
            </Link>
          </small>
          {isArchived ? (
            <Button
              ghost
              type="primary"
              className={css`
                margin-left: auto;
                color: orange;
                border-color: orange;
                &:focus, &:focus, &:hover {
                  color: orange;
                  border-color: orange;
                } 
              `}
              onClick={onUnarchiveTask}
            >
              Unarchive
            </Button>
          )
            : (
              <Button
                ghost
                type="primary"
                className={css`
                  margin-left: auto;
                  color: orange;
                  border-color: orange;
                  &:focus, &:focus, &:hover {
                    color: orange;
                    border-color: orange;
                  } 
                `}
                onClick={onArchiveTask}
              >
                Archive task
              </Button>
            )}
        </div>
      </Card>
      <Comments task={id} isArchived={isArchived} />
    </>
  )
}


export default TaskItem
