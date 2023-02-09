import Comment from '../domain/comments.js'
import { sendDataResponse, sendMessageResponse } from '../utils/responses.js'

export const create = async (req, res) => {
  const { content } = req.body

  if (!content) {
    return sendDataResponse(res, 400, { error: 'Must provide content' })
  }

  try {
    const commentToCreate = await Comment.fromJson(req.body)
    commentToCreate.userId = req.user.id
    const createdComment = await commentToCreate.save()

    return sendDataResponse(res, 201, {
      comment: { ...createdComment }
    })
  } catch (error) {
    console.log('this is the error', error)
    return sendMessageResponse(res, 500, 'Unable to create new comment')
  }
}
