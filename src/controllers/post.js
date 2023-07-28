import { sendDataResponse } from '../utils/responses.js'
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

  if (
    !content ||
    content.length <= 0 ||
    content === ' ' ||
    typeof content !== 'string'
  ) {
    return sendDataResponse(res, 400, { content: 'Must provide valid content' })
  }

  const userValidation = await prisma.post.findUnique({
    where: {
      id: postId
    },
    include: {
      user: true
    }
  })

  if (userId === userValidation.user.id) {
    const edited = await prisma.post.update({
      data: {
        content: content
      },
      where: {
        id: postId
      }
    })
    return sendDataResponse(res, 201, { post: edited })
  } else {
    return res.status(403).send('Missing Authorization')
  }
}

export const deletePost = async (req, res) => {
  const userId = req.user.id
  const postId = Number(req.params.id)

  const findPost = await prisma.post.findUnique({
    where: {
      id: postId
    },
    include: {
      user: true,
      comments: true
    }
  })

  if (!findPost) {
    return sendDataResponse(res, 404, { post: 'Not Found' })
  }


  if (userId === findPost.user.id && findPost.comments.length > 0) {
    await prisma.comment.deleteMany({
      where: {
        postId: postId
      }
    })
  }

  if (userId === findPost.user.id) {
    const deletion = await prisma.post.delete({
      where: {
        id: postId
      }
    })
    return sendDataResponse(res, 200, { post: deletion })
  } else {
    return sendDataResponse(res, 403, {
      error: 'You are unauthorized to delete this post'
    })
  }
}
