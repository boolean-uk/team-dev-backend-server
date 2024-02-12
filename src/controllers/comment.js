import Comment from '../domain/comment.js'
import { sendDataResponse } from '../utils/responses.js'

export const getComments = async (req, res) => {
  console.log('ran')
  const comments = await Comment.getAll()
  return sendDataResponse(res, 200, { comments })
}
