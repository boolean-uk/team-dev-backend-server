import { sendDataResponse } from '../utils/responses.js'
import {
  create,
  getAllForPost,
  updateComment,
  deleteComment
} from '../domain/comment.js'
import { findById } from '../domain/post.js'
import { Prisma } from '@prisma/client'

export const createComment = async (req, res) => {
  const { content } = req.body
  const postId = Number(req.params.id)
  if (!content) {
    return sendDataResponse(res, 400, { error: 'Must provide content' })
  }
  try {
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
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e.code === 'P2003') {
        return sendDataResponse(res, 404, { error: 'Post does not exist.' })
      }
    }
    return sendDataResponse(res, 500, { error: 'server error' })
  }
}

export const getAllComments = async (req, res) => {
  const postId = Number(req.params.id)
  try {
    const comments = await getAllForPost(postId)

    return sendDataResponse(res, 200, { comments })
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e.code === 'P2003') {
        return sendDataResponse(res, 404, { error: 'Post does not exist.' })
      }
    }
    return sendDataResponse(res, 500, { error: 'server error' })
  }
}

export const editComment = async (req, res) => {
  const id = Number(req.params.commentid)

  const { content } = req.body
  try {
    if (!req.body.content) {
      return sendDataResponse(res, 400, { error: 'Must provide content' })
    }
    const updatedComment = await updateComment(id, content)
    const updatedCommentWithAuthor = {
      comment: {
        id: updatedComment.id,
        content: updatedComment.content,
        createdAt: updatedComment.createdAt,
        updatedAt: updatedComment.updatedAt,
        author: { ...req.user }
      }
    }

    return sendDataResponse(res, 200, { updatedCommentWithAuthor })
  } catch (e) {
    return sendDataResponse(res, 500, { error: 'server error' })
  }
}

export const deleteCommentFromPost = async (req, res) => {
  const id = Number(req.params.commentid)
  const postId = Number(req.params.id)
  const foundPost = findById(postId)
  if (!foundPost) {
    return sendDataResponse(res, 404, { error: 'Post not Found.' })
  }
  try {
    const deletedComment = await deleteComment(id)

    const deletedCommentWithAuthor = {
      comment: {
        id: deletedComment.id,
        content: deletedComment.content,
        createdAt: deletedComment.createdAt,
        updatedAt: deletedComment.updatedAt,
        author: { ...req.user }
      }
    }
    return sendDataResponse(res, 200, { deletedCommentWithAuthor })
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e.code === 'P2025') {
        return sendDataResponse(res, 404, { error: 'Comment not Found.' })
      }
    }
    return sendDataResponse(res, 500, { error: 'server error' })
  }
}
