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
    console.error('error creating comment', error)
    return sendMessageResponse(res, 500, 'Unable to create new comment')
  }
}

export const getAll = async (req, res) => {
  const comments = await Comment.findAll()
  const formattedComments = comments.map((comment) => {
    return {
      ...comment.toJSON().comment
    }
  })
  return sendDataResponse(res, 200, { users: formattedComments })
}
