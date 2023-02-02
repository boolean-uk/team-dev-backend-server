import Post from '../domain/posts.js'
import { sendDataResponse, sendMessageResponse } from '../utils/responses.js'

export const create = async (req, res) => {
  const { content } = req.body

  if (!content) {
    return sendDataResponse(res, 400, { error: 'Must provide content' })
  }

  try {
    const postToCreate = await Post.fromJson(req.body)
    postToCreate.userId = req.user.id
    const createdPost = await postToCreate.save()

    if (!createdPost) {
      return sendDataResponse(res, 400, {
        error: 'Please log in before creating a post'
      })
    }

    return sendDataResponse(res, 201, {
      post: { ...createdPost }
    })
  } catch (error) {
    return sendMessageResponse(res, 500, 'Unable to create new post')
  }
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
