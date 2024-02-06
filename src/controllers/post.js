import { createPost, getPosts } from '../domain/post.js'
import { sendDataResponse } from '../utils/responses.js'

export const create = async (req, res) => {
  const { content } = req.body
  const userId = req.user.id

  if (!content) {
    return sendDataResponse(res, 400, { content: 'Must provide content' })
  }
  await createPost(content, userId)
  return sendDataResponse(res, 201, { post: { content } })
}

export const getAll = async (req, res) => {
  const posts = await getPosts()
  return sendDataResponse(res, 200, { posts })
}
