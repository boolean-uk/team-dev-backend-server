import { sendDataResponse } from '../utils/responses.js'
import { Prisma } from '@prisma/client'
import {
  createPost,
  getAllPosts,
  findById,
  deleteById,
  createLike
} from '../domain/post.js'

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
    return sendDataResponse(res, 500, { error: 'Unable to get Post' })
  }
}

export const likePost = async (req, res) => {
  const userId = Number(req.user.id)
  const postId = Number(req.params.id)

  try {
    const foundPost = await findById(postId)
    if (!foundPost) {
      return sendDataResponse(res, 404, { error: 'Post not found' })
    }
    const likedPost = await createLike(userId, postId)
    // Swapping the creator of the Post which has been liked, from user to author.
    const author = likedPost.post.user
    likedPost.post = {
      id: likedPost.post.id,
      content: likedPost.post.content,
      author: author
    }

    return sendDataResponse(res, 201, likedPost)
  } catch (e) {
    return sendDataResponse(res, 500, { error: 'Unable to get Post' })
  }
}

export const deletePost = async (req, res) => {
  const id = Number(req.params.id)
  try {
    const deletedPost = await deleteById(id)
    const post = {
      id: deletedPost.id,
      content: deletedPost.content,
      userId: deletedPost.userId,
      createdAt: deletedPost.createdAt,
      updatedAt: deletedPost.updatedAt,
      author: { ...deletedPost.user }
    }
    return sendDataResponse(res, 200, post)
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError) {
      if (e.code === 'P2025') {
        return sendDataResponse(res, 404, { error: 'Post does not exist.' })
      }
    }
    return sendDataResponse(res, 500, { error: 'Unable to delete post' })
  }
}
