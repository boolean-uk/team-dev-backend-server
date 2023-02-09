import Post from '../domain/posts.js'
import { sendDataResponse, sendMessageResponse } from '../utils/responses.js'

export const createLike = async (req, res) => {
  const id = Number(req.params.id)
  if (!id) {
    return sendDataResponse(res, 400, { error: 'Must provide post id' })
  }
  try {
    const foundPost = await Post.findById(id)

    if (!foundPost)
      return sendDataResponse(res, 404, {
        error: 'Post with given id not found'
      })

    let isLiked = false
    foundPost.likes.forEach((like) => {
      if (req.user.id === like.id) {
        isLiked = true
      }
    })

    if (isLiked) {
      return sendMessageResponse(res, 403, 'You already liked this post')
    }

    const likedPost = await foundPost.createLike(req.user.id)

    sendDataResponse(res, 200, { post: likedPost })
  } catch (error) {
    sendMessageResponse(res, 400, `Unable to like post: ${error}`)
  }
}
