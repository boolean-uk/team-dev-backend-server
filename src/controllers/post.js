import { sendDataResponse } from '../utils/responses.js'
import {
  createPost,
  getAllPosts,
  findById,
  updatePostById
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
    console.log('this one', e)
    return sendDataResponse(res, 500, { error: 'Unable to get Post' })
  }
}

export const updateById = async (req, res) => {
  const id = parseInt(req.params.id)

  const foundPost = await findById(id)
  if (!foundPost) {
    return sendDataResponse(res, 404, { error: 'Post not found' })
  }

  if (!req.body.content) {
    return sendDataResponse(res, 400, { error: 'Must provide content' })
  }
  const post = await updatePostById(id, req.body.content)
  const authorFrame = { ...foundPost.user }
  const author = {
    id: authorFrame.id,
    cohortId: authorFrame.cohortId,
    role: authorFrame.profile.role,
    firstName: authorFrame.profile.firstName,
    lastName: authorFrame.profile.lastName,
    bio: authorFrame.profile.bio,
    githubUrl: authorFrame.profile.githubUrl,
    profileImageUrl: authorFrame.profile.profileImageUrl
  }
  console.log('pre-object.assign POST=', post)
  Object.assign(post, { author })
  console.log('post-object.assign POST=', post)

  return sendDataResponse(res, 200, { post: post })
}
