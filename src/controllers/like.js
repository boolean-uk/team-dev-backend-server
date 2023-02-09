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

    const likedPost = await foundPost.createLike(req.user.id)

    sendDataResponse(res, 200, { post: likedPost })
  } catch (error) {
    console.error(error)
  }
}
