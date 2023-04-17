import { Prisma } from '@prisma/client'
import { sendDataResponse } from '../utils/responses.js'
import { createPost, getAllPosts, findById } from '../domain/post.js'
import dbClient from '../utils/dbClient.js'

export const create = async (req, res) => {
  const { content } = req.body

  if (!content) {
    return sendDataResponse(res, 400, { error: 'Must provide content' })
  }
  const createdPost = await createPost(content, req.user.id)

  return sendDataResponse(res, 201, {
    post: {
      id: createdPost.id,
      content: createdPost.content,
      createdAt: createdPost.createdAt,
      updatedAt: createdPost.updatedAt,
      author: { ...req.user }
    }
  })
}

export const getAll = async (req, res) => {
  const allPostsNoAuthor = await getAllPosts()

  const postsWithAuthor = allPostsNoAuthor.map((post) => {
    const { id, content, createdAt, updatedAt } = post
    const { cohortId, role } = post.user
    const { firstName, lastName, bio, githubUrl, profileImageUrl } =
      post.user.profile

    return {
      id,
      content,
      createdAt,
      updatedAt,
      author: {
        id: post.user.id,
        cohortId,
        role,
        firstName,
        lastName,
        bio,
        githubUrl,
        profileImageUrl
      }
    }
  })

  return sendDataResponse(res, 200, { posts: postsWithAuthor })
}

export const getById = async (req, res) => {
  const id = parseInt(req.params.id)
  try {
    const foundPost = await findById(id)
    if (!foundPost) {
      return sendDataResponse(res, 404, { error: 'Post not found' })
    }
    const post = {
      id: foundPost.id,
      content: foundPost.content,
      userId: foundPost.userId,
      createdAt: foundPost.createdAt,
      updatedAt: foundPost.updatedAt,
      author: { ...foundPost.user }
    }

    return sendDataResponse(res, 200, post)
  } catch (e) {
    console.log('this one', e)
    return sendDataResponse(res, 500, { error: 'Unable to get Post' })
  }
}

export const updateById = async (req, res) => {
  const data = {}

  const post = await dbClient.post.update({
    where: {
      id: Number(req.params.id)
    },
    data: {
      content: req.body.content
    },
    include: {
      user: {
        select: {
          id: true,
          role: true
        }
      }
    }
  })

  if (!req.body.content) {
    return sendDataResponse(res, 400, { error: 'Must provide content' })
  }

  try {
    if (req.user.role === 'TEACHER' || req.user.id === post.userId) {
      // console.log('yes')
      data.post = {
        content: req.body.content,
        updatedBy: req.user.id
      }
    } else {
      return sendDataResponse(res, 403, {
        authorization:
          'You must be the original poster or a teacher to edit this post'
      })
    }

    return sendDataResponse(res, 200, { post: data.post })
  } catch (e) {
    // TODO: figure out error for 404 instead of having app crash
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e.code === 'P2003') {
        return sendDataResponse(res, 404, { error: 'Post does not exist.' })
      }
    }
    return sendDataResponse(res, 500, { error: 'server error' })
  }
}
