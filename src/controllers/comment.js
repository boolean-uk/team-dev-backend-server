import { sendDataResponse } from '../utils/responses.js'
import dbClient from '../utils/dbClient.js'

export const createComment = async (req, res) => {
  const { content } = req.body

  if (!content) {
    return sendDataResponse(res, 400, { error: 'Must provide content' })
  }
  const createdComment = await dbClient.comment.create({
    data: {
      content: content,
      postId: parseInt(req.params.id),
      userId: req.user.id
    }
  })
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
