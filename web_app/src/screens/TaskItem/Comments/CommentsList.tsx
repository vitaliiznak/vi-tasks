import React, { Fragment } from 'react'
import { useQuery } from '@apollo/client'
import { GET_COMMENTS } from 'queries'
import { css } from '@emotion/css'
import { Tooltip } from 'antd'
import { HashLink } from 'react-router-hash-link'
import Comment from './Comment'
import { GetCommentsQuery } from 'queries/types'

interface TCommentsProperties {
  isArchived: boolean
  boardId: string
  filter: {
    task: string
    createdBy?: string
  }
}


const CommentsListAux = ({ commentIds, commentsMap, boardId, isArchived }: {
  isArchived: boolean
  boardId: string
  commentIds: any[],
  commentsMap: any,
}) => {
  return <>
    {commentIds.map((id: any) => {
      const comment = commentsMap[id]
      return (
        <Fragment key={comment.id}>
          <div
            id={comment.id}
          >
            <Comment
              linkAuthor={`/b/${boardId}/members/${comment.createdBy.id}`}
              comment={{
                ...comment,
                content: (
                  <>
                    <div>
                      {commentsMap[comment.previous]
                        ? (
                          <div className={css`margin-right: 10px;`}>
                            <Tooltip title={<HashLink smooth to={`#${commentsMap[comment.previous]?.id}`}>go to comment</HashLink>}>
                              @
                              {commentsMap[comment.previous]?.createdBy.fullName}
                            </Tooltip>
                          </div>
                        )
                        : ''}
                    </div>
                    <div>
                      {comment.content}
                    </div>
                  </>
                ),
              }}
              isArchived={isArchived}
              className={
                css`
                margin-left: ${comment.previous ? '12px' : '0'};
                ${comment.previous ? 'border-left: solid 0.5px rgba(252,252,252, 0.5); padding-left: 8px;' : ''};
              `}
            />
          </div>
          {Boolean(comment.repliesIds.length) &&
            <CommentsListAux commentIds={comment.repliesIds} commentsMap={commentsMap} boardId={boardId} isArchived={isArchived} />}
        </Fragment>
      )
    })}
  </>
}

const CommentsList = ({ filter, boardId, isArchived }: TCommentsProperties) => {
  const { data: commentsQueryData } = useQuery<GetCommentsQuery>(GET_COMMENTS, {
    variables: {
      filter,
      withReplies: {
        limit: 20,
      },
    },
  })
  if (commentsQueryData == undefined) return null
  const { commentGetList: comments } = commentsQueryData
  const commentsMap = comments.reduce((accum, comment) => {
    if (!comment?.previous) {
      return {
        ...accum,
        [comment!.id]: {
          ...comment,
          repliesIds: [],
        },
      }
    }
    const topComment = accum[comment.previous] || {}
    return {
      ...accum,
      [comment.id]: {
        ...comment,
        repliesIds: [],
      },
      [comment.previous]: {
        ...topComment,
        id: comment.previous,
        repliesIds: [...(topComment.repliesIds || []), comment.id],
      },
    }
  }, {} as any)

  const commentIds = Object.values(commentsMap).filter((comment: any) => !comment.previous).map((comment: any) => comment.id)


  return !Boolean(commentIds.length) ? (<div className={css`text-align: center;`}>no comments yet</div>) : <CommentsListAux commentIds={commentIds} commentsMap={commentsMap} boardId={boardId} isArchived={isArchived} />
}

export default CommentsList
