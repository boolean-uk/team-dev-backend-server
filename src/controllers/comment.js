import Comment from '../domain/comment.js'
import { sendDataResponse, sendMessageResponse } from '../utils/responses.js'

export const createComment = async (req, res) => {
  const { id } = req.user
  const { postId } = req.params
  const { content } = req.body
  const commentToCreate = await Comment.fromJson(content, id, Number(postId))

  try {
    if (!commentToCreate.content) {
      return sendMessageResponse(res, 400, { content: 'Must provide content' })
    }

    const createdComment = await commentToCreate.saveComment()
    delete createdComment.commentId

    return sendDataResponse(res, 201, createdComment)
  } catch {
    return sendMessageResponse(res, 500, 'Unable to create a comment')
  }
}

export const replayToComment = async (req, res) => {
  const { id } = req.user
  const { postId, commentId } = req.params
  const { content } = req.body
  const commentToCreate = await Comment.fromJson(
    content,
    id,
    Number(postId),
    Number(commentId)
  )
  try {
    if (!commentToCreate.content) {
      return sendMessageResponse(res, 400, { content: 'Must provide content' })
    }

    const createdComment = await commentToCreate.saveCommentToComment()

    return sendDataResponse(res, 201, createdComment)
  } catch {
    return sendMessageResponse(res, 500, 'Unable to create a comment')
  }
}
