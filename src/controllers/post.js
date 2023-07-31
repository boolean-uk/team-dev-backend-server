import { sendDataResponse } from '../utils/responses.js'
import {
  clearComments,
  findPost,
  findPostWithComments,
  editPost as editPostDomain // change this import
} from '../domain/post.js'
import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

export const create = async (req, res) => {
  const { content } = req.body
  const userId = req.user.id

  if (!content || content === '' || typeof content !== 'string') {
    return sendDataResponse(res, 400, { content: 'Must provide valid content' })
  }

  const createdPost = await prisma.post.create({
    data: {
      content: content,
      userId: userId
    },
    select: {
      id: true,
      content: true
    }
  })

  return sendDataResponse(res, 201, {
    post: createdPost
  })
}

export const getAll = async (req, res) => {
  return sendDataResponse(res, 200, {
    posts: [
      {
        id: 1,
        content: 'Hello world!',
        author: { ...req.user }
      },
      {
        id: 2,
        content: 'Hello from the void!',
        author: { ...req.user }
      }
    ]
  })
}

export const editPost = async (req, res) => {
  const { content } = req.body
  const userId = req.user.id
  const postId = Number(req.params.id)
  const userRole = req.user.role

  if (
    !content ||
    content.length <= 0 ||
    content === ' ' ||
    typeof content !== 'string'
  ) {
    return sendDataResponse(res, 400, { content: 'Must provide valid content' })
  }

  const userValidation = findPost(postId)

  if (!userValidation) {
    return sendDataResponse(res, 404, { post: 'Not Found' })
  }

  if (userRole !== 'TEACHER' && userId !== userValidation.user.id) {
    return sendDataResponse(res, 403, { error: 'Missing Authorization' })
  }
  const edited = editPostDomain(content, postId) // Change this before commiting
  return sendDataResponse(res, 200, { post: edited })
}

export const deletePost = async (req, res) => {
  const userId = req.user.id
  const postId = Number(req.params.id)
  const userRole = req.user.role

  const findPost = findPostWithComments(postId)

  if (!findPost) {
    return sendDataResponse(res, 404, { post: 'Not Found' })
  }

  if (userRole !== 'TEACHER' && userId !== findPost.user.id) {
    return sendDataResponse(res, 403, {
      error: 'You are unauthorized to delete this post'
    })
  }

  if (findPost.comments.length > 0) {
    clearComments(postId)
  }
  const deletion = deletePost(postId)
  return sendDataResponse(res, 200, { post: deletion })
}
