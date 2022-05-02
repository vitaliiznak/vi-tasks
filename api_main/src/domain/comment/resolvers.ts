/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import { TAuthorizedUser } from '../../server'
import CommentService from '../../services/comment'
import UserService from '../../services/user'

const commentCount = (
  _prev,
  { filter },
  _context,
  _info,
) => CommentService.count(filter)

const commentGetList = (
  _prev,
  { filter, withReplies },
  _context,
  _info,
) => CommentService.getList(filter, withReplies)

const commentGetById = (
  _prev,
  { id },
  _context,
  _info,
) => CommentService.getById(id)

const commentCreate = (
  _prev,
  {
    input:
    {
      content,
      task,
    },
  },
  { user }: {
    user: TAuthorizedUser
  },
  _info,
) => CommentService.create({
  content,
  taskId: task,
  createdBy: user.id,
})

const commentReplyCreate = (
  _prev,
  {
    input:
    {
      content,
      previous,
    },
  },
  { user }: {
    user: TAuthorizedUser
  },
  _info,
) => CommentService.createReply({
  content,
  previousId: previous,
  createdBy: user.id,
})

const commentUpdate = (
  _prev,
  _req,
  _context,
  _info,
) => [] // TaskService.update(id)

const commentRemove = (
  _prev,
  { id },
  _context,
  _info,
) => CommentService.remove(id)

export default {
  Comment: {
    createdBy: ({ createdById }) =>
      // Filter the hardcoded array of books to only include
      // books that are located at the correct branch
      UserService.getById(createdById),
    replyToUser: ({ replyToUserId }) =>
      // Filter the hardcoded array of books to only include
      // books that are located at the correct branch
      (replyToUserId ? UserService.getById(replyToUserId) : undefined),

  },
  Query: {
    commentCount,
    commentGetList,
    commentGetById,
    /*    job,
       jobs, */
  },
  Mutation: {
    commentCreate,
    commentReplyCreate,
    // commentUpdate,
    commentRemove,
  },
}
