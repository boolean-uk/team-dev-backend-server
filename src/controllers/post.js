import { sendDataResponse, sendMessageResponse } from '../utils/responses.js'
import Post from '../domain/post.js'

export const create = async (req, res) => {
  console.log('here the user: ', req.user)
  const { id } = req.user
  const { content } = req.body
  const postToCreate = await Post.fromJson(content, id)
  try {
    if (!postToCreate.content) {
      return sendMessageResponse(res, 400, { content: 'Must provide content' })
    }

    const createdPost = await postToCreate.savePost()
    return sendDataResponse(res, 201, createdPost)
  } catch (e) {
    console.log(e)
    return sendMessageResponse(res, 500, 'Unable to create a post')
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
