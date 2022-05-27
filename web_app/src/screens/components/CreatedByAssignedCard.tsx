
import { useReactiveVar } from '@apollo/client'
import { css } from '@emotion/css'
import { Tooltip } from 'antd'
import { gSelectedBoard } from '@src/appState/appState'
import React from 'react'
import { Link } from 'react-router-dom'
import AvatarZ from './AvatarZ'

const CreatedByAssignedCard = ({
  id,
  avatar,
  fullName,
  email,
  link,
}: {
  id: string,
  avatar: {
    file: {
      uri: string
    }
  },
  fullName: string,
  email: string,
  link?: string

}) => {
  const board = useReactiveVar(gSelectedBoard)

  const ViewNameEmail = (
    <div
      className={css`
        padding-left: 4px;
        width: 100%;
      `}
    >
      <div
        className={css`
        overflow: hidden !important;
        white-space: nowrap !important;
        text-overflow: ellipsis !important;
      `}
      >
        <Link target="_blank" to={link || `/b/${board!.id}/members/${id}`}>
          {fullName}
        </Link>
      </div>
      <div
        className={css`
          overflow: hidden !important;
          white-space: nowrap !important;
          text-overflow: ellipsis !important;
        `}
      >
        {email}
      </div>
    </div>
  )

  return (
    <Tooltip
      placement="topLeft"
      title={(
        <div
          className={css`display: flex;`}
        >
          <AvatarZ
            fullName={fullName}
            avatarSrc={avatar?.file?.uri}
          />
          {ViewNameEmail}
        </div>
      )}
    >
      <div
        className={css`
        display: flex;
        border: 1px dashed rgba(91,91,91, 0.7);
        width: 100%;
        font-size: 10px;
      `}
      >
        {ViewNameEmail}
      </div>
    </Tooltip>
  )
}


export default CreatedByAssignedCard
