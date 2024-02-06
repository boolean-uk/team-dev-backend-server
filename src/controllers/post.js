import { createPost, getPosts } from '../domain/post.js'
import { sendDataResponse } from '../utils/responses.js'

export const create = async (req, res) => {
  const { content } = req.body
  const userId = req.user.id

  if (!content) {
    return sendDataResponse(res, 400, { content: 'Must provide content' })
  }

  try {
    const post = await createPost(content, userId)
    return sendDataResponse(res, 201, post)
  } catch (e) {
    console.error('error creating post', e.message)
    return sendDataResponse(res, 500, 'something went wrong')
  }
}

export const getAll = async (req, res) => {
  const posts = await getPosts()
  const newPostsList = posts.map((post) => {
    const author = post.user.profile
      ? {
          firstName: post.user.profile.firstName,
          lastName: post.user.profile.lastName
        }
      : { firstName: 'unknown', lastName: 'unknown' }

    return {
      id: post.id,
      content: post.content,
      createdAt: post.createdAt,
      updatedAt: post.updatedAt,
      userId: post.user.id,
      author
    }
  })
  return sendDataResponse(res, 200, { posts: newPostsList })
}
