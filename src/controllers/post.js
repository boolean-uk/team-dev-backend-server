import {
  createPost,
  getPosts,
  deletePostByIdAndUserId
} from '../domain/post.js'
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
  return sendDataResponse(res, 200, { posts })
}

export const deletePost = async (req, res) => {
  const postId = parseInt(req.params.postid)
  const userId = req.user.id

  if (!postId) {
    console.error('Invalid post id')
    return sendDataResponse(res, 400, { error: 'Invalid post id' })
  }

  try {
    const { error, status, success } = await deletePostByIdAndUserId(
      postId,
      userId
    )

    if (error) {
      console.error(error)
      return sendDataResponse(res, status, { error })
    }

    if (success) {
      return sendDataResponse(res, 201, {
        message: 'Post deleted successfully'
      })
    }
  } catch (error) {
    console.error('Error deleting post:', error.message)
    return sendDataResponse(res, 500, { error: 'Something went wrong' })
  }
}
