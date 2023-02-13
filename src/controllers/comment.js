import Comment from '../domain/comments.js'
import Post from '../domain/posts.js'
import { sendDataResponse, sendMessageResponse } from '../utils/responses.js'

export const createComment = async (req, res) => {
  const { content } = req.body
  const id = Number(req.params.id)
  if (!content) {
    return sendDataResponse(res, 400, { error: 'Must provide content' })
  }

  try {
    const foundPost = await Post.findById(id)
    if (!foundPost)
      return sendDataResponse(res, 404, {
        error: 'Post with given id not found'
      })
    const commentToCreate = await Comment.fromJson(req.body)

    commentToCreate.postId = foundPost.id
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

export const getAllComments = async (req, res) => {
  const id = Number(req.params.id)

  const foundPost = await Post.findById(id)
  if (!foundPost)
    return sendDataResponse(res, 404, {
      error: 'Post with given id not found'
    })

  if (!foundPost.comments) {
    return sendDataResponse(res, 404, { error: 'This post has no comments' })
  }
  const comments = foundPost.comments

  return sendDataResponse(res, 200, { comments: comments })
}

export const updateComment = async (req, res) => {
  const commentId = Number(req.params.commentId)
  const { content } = req.body

  if (!content) {
    return sendDataResponse(res, 400, { error: 'Must provide content' })
  }
  if (!commentId) {
    return sendDataResponse(res, 400, { error: 'Valid id not given' })
  }
  try {
    const foundComment = await Comment.findById(commentId)
    if (!foundComment) {
      return sendDataResponse(res, 404, {
        error: 'Comment with given id not found'
      })
    }

    foundComment.content = content
    const updatedComment = await foundComment.updateById()
    return sendDataResponse(res, 201, { updatedComment })
  } catch (error) {
    console.error('error caught:', error)
    sendMessageResponse(res, 500, `Unable to update comment: ${error}`)
  }
}

export const deleteCommentById = async (req, res) => {
  const postId = Number(req.params.postId)
  const commentId = Number(req.params.commentId)

  try {
    if (!postId) {
      return sendDataResponse(res, 400, { error: 'Valid Id must be given' })
    }

    const commentExists = await Comment.findById(commentId)

    if (!commentId) {
      return sendDataResponse(res, 400, { error: 'Valid id must be given' })
    }
    if (req.user.role === 'TEACHER' || req.user.id === commentExists.user.id) {
      return sendMessageResponse(
        res,
        403,
        'You are unble to delete this comment'
      )
    }
    const deletedComment = await commentExists.delete()

    return sendDataResponse(res, 201, {
      deletedComment
    })
  } catch (error) {
    return sendMessageResponse(res, 500, `Unable to delete comment: ${error}`)
  }
}
