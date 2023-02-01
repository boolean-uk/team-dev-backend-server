import Post from '../domain/posts.js'
import { sendDataResponse } from '../utils/responses.js'

export const create = async (req, res) => {
  const { content } = req.body

  if (!content) {
    return sendDataResponse(res, 400, { content: 'Must provide content' })
  }
  console.log(req.user)
  const postToCreate = await Post.fromJson(req.body)
  postToCreate.userId = req.user.id
  const createdPost = await postToCreate.save()

  return sendDataResponse(res, 201, {
    status: 'Great success!',
    data: createdPost
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
