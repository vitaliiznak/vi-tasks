import React from 'react'
import {
  Table, Tooltip, Tag,
} from 'antd'
import { css } from '@emotion/css'
import { Link } from 'react-router-dom'
import AvatarZ from 'screens/components/AvatarZ'
import { useQuery, useReactiveVar } from '@apollo/client'
import moment from 'moment'


import { GET_INVITES } from 'queries'
import { gSelectedBoard } from 'appState/appState'
import { GetInvitesQuery } from 'queries/types'

const InviteList = ({
  className = '',
  filter = {}
}: {
  className?: string,
  filter?: object
}) => {
  const board = useReactiveVar(gSelectedBoard)
  const { loading, data } = useQuery<GetInvitesQuery>(GET_INVITES, {
    variables: {
      filter: {
        board: board!.id,
        ...filter
      },
    },
  })


  const columns = [
    {
      title: 'State',
      key: 'state',
      render: ({ state }: any) => {
        const stateTagColor = state === 'EXPIRED' ? 'red' : undefined
        return (
          <div>
            <Tag color={stateTagColor}>
              {state}
            </Tag>
          </div>
        )
      },
    },
    {
      title: 'Expiration time',
      key: 'expirationTime',
      render: ({ expirationTime }: any) => (
        <div>
          {moment(expirationTime).format('DD/MM/YYYY, h:mm')}
        </div>
      ),
    },
    {
      title: 'Invitatiuon code',
      key: 'token',
      dataIndex: 'token'
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
                  <Link target="_blank" to={`/b/${board!.id}/members/${id}`}>
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
    }
  ]

  return (
    <>
      <Table
        className={className}
        loading={loading}
        rowKey="id"
        pagination={{
          hideOnSinglePage: true,
          showTotal: (total) => `Total ${total} items`,
        }}
        columns={columns}
        dataSource={data && data.inviteGetList ? data.inviteGetList as any[] : []}
        expandable={{
          expandedRowRender: ({ id, description, token }) => {
            return (
              <div className={css`padding: 8px;`}>
                <strong>Send the link and the token to the person you would like to invite</strong>
                <br />
                <strong className={css`font-size: 14px;padding-right: 8px;`}>Invitation link: </strong>
                <Link
                  target="_blank"
                  rel="noopener noreferrer"
                  to={`/p/invites/${id}`}
                >
                  {`${window.location.protocol}//${window.location.host}/p/invites/${id}`}
                </Link>
                <div>
                  <br />
                  <strong>Token:</strong>
                  <br />
                  <strong className={css`font-size:11px;`}>
                    {token}
                  </strong>
                </div>
                <div className={css`font-size: 14px;padding-top: 8px;`}>  <strong> Invitation message:</strong></div>
                <p>
                  {description}
                </p>
              </div>
            )
          }
        }}
      />

    </>
  )
}


export default InviteList
