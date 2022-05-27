import React, { useState } from 'react'
import {
  Table, Card, Tooltip, Button, Modal,
} from 'antd'
import { css } from '@emotion/css'
import { useMutation, useReactiveVar } from '@apollo/client'
import { ExclamationCircleOutlined } from '@ant-design/icons'

import { Link, useNavigate } from 'react-router-dom'
import { REMOVE_BOARD } from '@src/queries'
import AvatarZ from '@src/screens/components/AvatarZ'
import { gBoards, gSelectedBoard } from '@src/appState/appState'
import BoardNew from './BoardNew'
import { RemoveBoardMutation } from '@src/queries/types'
import moment from 'moment'

const { confirm } = Modal

const auxStylesContainer = css`
  max-width: 1000px;
  margin-left: auto;
  margin-right: auto;
`
export default ({
  title = null,
  className = '',
}: {
  title?: JSX.Element | null,
  className?: string
}) => {
  const navigate = useNavigate()
  const [modalNewBoardConfig, setModalNewBoardConfig] = useState<any>(null)
  const [removeBoard] = useMutation<RemoveBoardMutation>(REMOVE_BOARD)
  const board = useReactiveVar(gSelectedBoard)
  const boards = useReactiveVar(gBoards)

  const onRemove = (id: string) => (_event: any) => {
    confirm({
      title: 'Do you want to delete these board?',
      icon: <ExclamationCircleOutlined />,
      content: 'All your tasks, history and comunications will be deleted',
      okText: 'Yes',
      okType: 'danger',
      onOk() {
        removeBoard({
          variables: {
            id,
          },
          refetchQueries: ['GetBoards', 'GetBoard'],
        })
      },
    })
  }

  const columns = [
    {
      title: 'Title',
      key: 'title',
      render: ({ id, title: titleArgument }: any) => (
        <div>
          <div>
            <Link type="primary" to={`/b/${id}`}>
              <strong>{titleArgument}</strong>
            </Link>
          </div>
          <small className={css`font-size: 8px;`}>
            {id}
          </small>
        </div>
      ),
    },
    {
      title: 'Created at',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: ({
        createdAt
      }: any) => (
        moment(createdAt).format('DD MMMM YYYY')
      ),
    },
    {
      title: 'Created by',
      dataIndex: 'createdBy',
      key: 'createdBy',
      render: ({
        fullName, email, avatar, id,
      }: any) => (
        <Tooltip
          placement="topRight"
          title={(
            <div
              className={css`
                display: flex;
              `}
            >
              <AvatarZ avatarSrc={avatar?.file?.uri} fullName={fullName} />
              <div
                className={css`
                  padding-left: 4px;
              `}
              >
                <div>
                  <Link target="_blank" to={`/b/${board?.id}/members/${id}`}>
                    {fullName}
                  </Link>
                </div>
                <div className={css`font-size: 11px;`}>{email}</div>
              </div>
            </div>
          )}
          arrowPointAtCenter
        >
          <div>{fullName}</div>
          <div className={css`font-size: 11px;`}>{email}</div>
        </Tooltip>
      ),
    },

    {
      title: 'Actions',
      key: 'actions',
      render: ({ id }: any) => (
        <div className={css`display:flex;justify-content: flex-end;`}>
          <Tooltip
            placement="topRight"
            title="delete board"
            arrowPointAtCenter
          >
            <Button danger ghost onClick={onRemove(id)}>
              Remove
            </Button>
          </Tooltip>
        </div>
      ),
    },
  ]

  const stylesContainer = `${auxStylesContainer} ${className}`
  return (
    <>
      {Boolean(modalNewBoardConfig) && (
        <Modal
          maskClosable={false}
          onCancel={() => {
            setModalNewBoardConfig(null)
          }}
          title="Create board"
          visible
          width={340}
          footer={null}
        >
          <BoardNew
            onDone={({ id }: any) => {
              navigate(`/b/${id}`)
              setModalNewBoardConfig(null)
            }}
            footer={() => (
              <div className={css`display: flex; justify-content: space-between;`}>
                <Button
                  type="primary"
                  ghost
                  onClick={() => {
                    setModalNewBoardConfig(null)
                  }}
                  htmlType="reset"
                >
                  Cancel
                </Button>
                <Button
                  type="primary"
                  ghost
                  htmlType="submit"
                >
                  Create
                </Button>
              </div>
            )}
          />
        </Modal>
      )}

      <Card
        title={(
          <div className={css`display: flex; padding-bottom: 18px;justify-content:space-between;`}>
            {title}
            <Button
              size="large"
              type="primary"
              ghost
              onClick={() => {
                setModalNewBoardConfig({})
              }}
              className={css`margin-left: auto;`}
            >
              Create new board
            </Button>
          </div>
        )}
        className={stylesContainer}
      >
        <Table
          rowKey="id"
          loading={!boards}
          pagination={{
            hideOnSinglePage: true,
            showTotal: (total) => `Total ${total} items`,
          }}
          columns={columns}
          dataSource={boards || [] as any}
        /*   expandable={{
            expandedRowRender: ({id}: any) => (<TaskItem id={id}/>),
            rowExpandable: () => true,
          }} */
        />
      </Card>
    </>
  )
}
