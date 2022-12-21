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

export const getPost = async (req, res) => {
  try {
    const { postId } = req.params

    const post = await Post.getPostById(postId)

    if (!post) {
      return sendMessageResponse(res, 404, 'Post not found.')
    }

    return sendDataResponse(res, 201, post)
  } catch (e) {
    console.error(e)
    return sendMessageResponse(res, 500, 'Something went wrong.')
  }
}

export const getAll = async (req, res) => {
  try {
    let posts = await Post.findAll()
    posts = posts.forEach((post) => {
      delete post.userId
      return post
    })

    return sendDataResponse(res, 200, posts)
  } catch (error) {
    return sendMessageResponse(res, 500, 'Unable to create a post')
  }
}
