import { sendDataResponse, sendMessageResponse } from '../utils/responses.js'
import { createPost } from '../domain/post.js'

export const create = async (req, res) => {
  const { content, userId } = req.body

  if (!content) {
    return sendMessageResponse(res, 400, { content: 'Must provide content' })
  }

  console.log(createPost(content, userId))
  const post = await createPost(content, userId)

  return sendDataResponse(res, 201, post)
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
