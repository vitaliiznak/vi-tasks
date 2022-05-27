import React, { ReactElement, useState } from 'react'
import { Comment as CommentAntd, Tooltip, Button } from 'antd'
import moment from 'moment'
import { css } from '@emotion/css'
import { CloseOutlined } from '@ant-design/icons'
import { Link } from 'react-router-dom'
import AvatarZ from '@src/screens/components/AvatarZ'
import AddComment from './AddComment'

const Comment = ({
  isArchived = false,
  className,
  linkAuthor,
  comment: {
    id,
    createdBy,
    content,
    createdAt,

  },
}:
  {
    className?: string,
    isArchived: boolean,
    linkAuthor: string,
    comment: {
      id: string,
      content: string | ReactElement | undefined
      createdAt: string
      createdBy: {
        id: string
        fullName: string
        avatar: {
          file?: {
            uri: string
          }
        }
      }
    }
  }) => {
  const [isReplyActive, setReplyActive] = useState(false)

  const onReply = (_event: React.MouseEvent<HTMLElement, MouseEvent>) => {
    setReplyActive(true)
  }

  const onReplyClose = (_event: React.MouseEvent<HTMLElement, MouseEvent>) => {
    setReplyActive(false)
  }

  return (
    <div className={className}>
      <CommentAntd
        className={
          css`
          & .ant-comment-actions{
              display:flex;
              justify-content: flex-end;
          }`
        }
        avatar={(
          <AvatarZ
            avatarSrc={createdBy.avatar?.file?.uri}
            fullName={createdBy.fullName}
          />
        )}
        author={(
          <Link target="_blank" to={linkAuthor}>
            {createdBy.fullName}
          </Link>
        )}
        content={(
          <span>
            {content}
          </span>
        )}
        datetime={(
          <Tooltip title={moment(createdAt).format('YYYY-MM-DD HH:mm:ss')}>
            <span>{moment(createdAt).fromNow()}</span>
          </Tooltip>
        )}
        actions={[
          isArchived
            ? (
              <Tooltip title="You can not reply on archive task">
                <Button disabled key="replyTo" size="small" type="text">Reply</Button>
              </Tooltip>
            )
            : (isReplyActive
              ? (
                <Button key="replyTo" size="small" type="text" onClick={onReplyClose}>
                  <CloseOutlined />
                </Button>
              )
              : <Button key="replyTo" size="small" type="text" onClick={onReply}>Reply</Button>),
        ]}
      />
      <div className={
        css`
          padding-left: 32px;
          display: ${isReplyActive ? 'block' : 'none'};
        `
      }
      >
        <AddComment previous={id} onFinish={() => { setReplyActive(false) }} />
      </div>
    </div>
  )
}

export default Comment
