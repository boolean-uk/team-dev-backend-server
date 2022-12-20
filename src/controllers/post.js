import Post from '../domain/post.js'
import { sendDataResponse, sendMessageResponse } from '../utils/responses.js'

export const create = async (req, res) => {
  const { id } = req.user
  const { content } = req.body
  const postToCreate = await Post.fromJson(content, id)
  try {
    if (!postToCreate.content) {
      return sendMessageResponse(res, 400, { content: 'Must provide content' })
    }

    const createdPost = await postToCreate.savePost()
    return sendDataResponse(res, 201, createdPost)
  } catch {
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

export const edit = async (req, res) => {
  const { id } = req.user
  const { content } = req.body
  const postId = parseInt(req.params.postId)

  const postToEdit = await Post.findOnePost(postId)

  if (!postToEdit || postToEdit.userId !== id) {
    return sendMessageResponse(
      res,
      404,
      'Post not found or you are not the author'
    )
  }
  try {
    const updatedPost = await Post.updatePost(postId, content)

    return sendDataResponse(res, 200, Post.fromDb(updatedPost))
  } catch {
    return sendMessageResponse(res, 500, 'Unable to update the post')
  }
}
