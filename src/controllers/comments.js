import { sendDataResponse } from '../utils/responses.js'

// DB
import { createCommentDb } from '../domain/comments.js'

export const createComment = async (req, res) => {
  const data = req.body

  const createdComment = await createCommentDb(data)

  return sendDataResponse(res, 201, createdComment)
}
