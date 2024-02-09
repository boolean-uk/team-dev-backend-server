import { sendDataResponse } from '../utils/responses.js'

// DB
import { createCommentDb } from '../domain/comments.js'

export const createComment = async (req, res) => {
  const { postId, content } = req.body
  const userId = req.user.id

  console.log(req.user)

  const createdComment = await createCommentDb({ userId, postId, content })

  return sendDataResponse(res, 201, createdComment)
}
