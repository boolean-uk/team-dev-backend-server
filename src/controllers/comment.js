import Comment from '../domain/comment.js'
import { sendDataResponse, sendMessageResponse } from '../utils/responses.js'

export const createComment = async (req, res) => {
  const { id } = req.user
  const { postId } = req.params
  const { content } = req.body
  const commentToCreate = await Comment.fromJson(content, id, postId)
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

export const getComment = async (req, res) => {
  try {
    const { commentId } = req.params
    console.log('HELLO')
    const comment = await Comment.findCommentById(commentId)
    if (!comment) {
      return sendMessageResponse(res, 404, 'Comment not found.')
    }

    return sendDataResponse(res, 201, comment)
  } catch (e) {
    console.error(e)
    return sendMessageResponse(res, 500, 'Something went wrong.')
  }
}

export const replyToComment = async (req, res) => {
  const { id } = req.user
  const { postId, commentId } = req.params
  const { content } = req.body
  const commentToCreate = await Comment.fromJson(content, id, postId, commentId)
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
