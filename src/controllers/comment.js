import Comment from '../domain/comment.js'
import { sendDataResponse } from '../utils/responses.js'

export const getComments = async (req, res) => {
  const comments = await Comment.getAll()
  return sendDataResponse(res, 200, { comments })
}

export const createComment = async (req, res) => {
  const json = req.body
  json.userId = req.user.id

  const commentToCreate = await Comment.fromJson(req.body)
  const createdComment = await commentToCreate.save()

  return sendDataResponse(res, 201, createdComment)
}

export const getCommentsByPost = async (req, res) => {
  const { postId } = req.params

  const comments = await Comment.getCommentsByPostId(postId)

  return sendDataResponse(res, 200, { comments })
}
