import Comment from '../domain/commentss.js'
import { sendDataResponse, sendMessageResponse } from '../utils/responses.js'

export const create = async (req, res) => {
  const { content } = req.body

  if (!content) {
    return sendDataResponse(res, 400, { error: 'Must provide content' })
  }

  try {
    const commentToCreate = await Comment.fromJson(req.body)
    commentToCreate.userId = req.user.id
    const createdComment = await commentToCreate.save()

    if (!createdComment) {
      return sendDataResponse(res, 400, {
        error: 'User details not provided for creating a comment'
      })
    }

    return sendDataResponse(res, 201, {
      post: { ...createdComment }
    })
  } catch (error) {
    return sendMessageResponse(res, 500, 'Unable to create new comment')
  }
}

export const getAll = async (req, res) => {
  try {
    let posts = await Comment.findAll()
    posts = posts.map((obj) => {
      const post = JSON.parse(JSON.stringify(obj)).post
      post.author = post.user
      delete post.user
      return post
    })

    return sendDataResponse(res, 200, { posts })
  } catch (error) {
    console.error('finding all posts', error)
    return sendMessageResponse(res, 401, 'Unable to get posts')
  }
}

export const deleteById = async (req, res) => {
  const id = Number(req.params.id)

  if (!id) return sendDataResponse(res, 404, { error: 'Valid id not given' })

  try {
    const foundPost = await Comment.findById(id)
    if (!foundPost)
      return sendDataResponse(res, 404, {
        error: 'Post with given id not found'
      })

    if (req.user.role === 'STUDENT' && req.user.id !== foundPost.user.id)
      return sendMessageResponse(res, 403, 'You are unable to delete this post')

    const deletedPost = await foundPost.delete()

    return sendDataResponse(res, 201, {
      deletedPost
    })
  } catch (error) {
    return sendMessageResponse(res, 400, `Unable to delete posts: ${error}`)
  }
}

export const updateById = async (req, res) => {
  const id = Number(req.params.id)
  const { content } = req.body

  if (!content) {
    return sendDataResponse(res, 400, { error: 'Content must be provided!' })
  }
  if (!id) return sendDataResponse(res, 404, { error: 'Valid id not given' })
  try {
    const foundPost = await Comment.findById(id)

    if (!foundPost)
      return sendDataResponse(res, 404, {
        error: 'Post with given id not found'
      })

    if (req.user.id !== foundPost.user.id)
      return sendMessageResponse(
        res,
        403,
        "Unable to edit other people's posts!"
      )
    foundPost.content = content
    const updatedPost = await foundPost.updateById()
    return sendDataResponse(res, 201, { updatedPost })
  } catch (error) {
    return sendMessageResponse(res, 400, `Unable to update posts: ${error}`)
  }
}
