import { sendDataResponse } from '../utils/responses.js'
import { create } from '../domain/comment.js'

export const createComment = async (req, res) => {
  const { content } = req.body
  const postId = parseInt(req.params.id)
  if (!content) {
    return sendDataResponse(res, 400, { error: 'Must provide content' })
  }
  const createdComment = await create(content, postId, req.user.id)
  return sendDataResponse(res, 201, {
    comment: {
      id: createdComment.id,
      content: createdComment.content,
      createdAt: createdComment.createdAt,
      updatedAt: createdComment.updatedAt,
      author: { ...req.user }
    }
  })
}
