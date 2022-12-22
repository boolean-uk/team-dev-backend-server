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

const checkContent = (content) => {
  if (!content || typeof content !== 'string' || content.trim().length === 0) {
    throw new Error('Content field is required and must be a non-empty string')
  }
}

export const edit = async (req, res) => {
  const { id, role } = req.user
  const { content } = req.body
  const postId = parseInt(req.params.postId)

  try {
    checkContent(content)
  } catch (error) {
    return sendMessageResponse(res, 400, error.message)
  }

  try {
    const postToEdit = await Post.findPost(postId, true)
    const { canWork, error } = canWorkOnPost({ id, role }, postToEdit)
    if (!canWork) {
      return sendMessageResponse(res, 404, error)
    }
    const updatedPost = await Post.updatePost(postId, content)

    return sendDataResponse(res, 200, { post: updatedPost })
  } catch {
    return sendMessageResponse(res, 500, 'Unable to update the post')
  }
}

const canWorkOnPost = (user, post) => {
  if (!post) {
    return { canWork: false, error: 'Post not found' }
  }
  if (user.id !== post.userId && user.role !== 'TEACHER') {
    return { canWork: false, error: 'You are not the author' }
  }
  return { canWork: true }
}

export const deletePost = async (req, res) => {
  const { id, role } = req.user
  const postId = parseInt(req.params.postId)

  const postToDelete = await Post.findPost(postId, true)

  const { canWork, error } = canWorkOnPost({ id, role }, postToDelete)
  if (!canWork) {
    return sendMessageResponse(res, 404, error)
  }

  try {
    if (postToDelete.comment.length > 0) {
      await Post.deletePostComments(postId)
    }

    const deletedPost = await Post.deletePost(postId)

    return sendDataResponse(res, 200, { post: Post.fromDb(deletedPost) })
  } catch {
    return sendMessageResponse(res, 500, 'Unable to delete the post')
  }
}
