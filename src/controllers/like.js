import Post from '../domain/posts.js'
import User from '../domain/user.js'
import Comment from '../domain/comments.js'
import { sendDataResponse, sendMessageResponse } from '../utils/responses.js'

export const createLike = async (req, res) => {
  const id = Number(req.params.id)
  if (!id) {
    return sendDataResponse(res, 400, { error: 'Must provide post id' })
  }
  try {
    const foundPost = await Post.findById(id)

    if (!foundPost) {
      return sendDataResponse(res, 404, {
        error: 'Post with given id not found'
      })
    }

    let isLiked = false
    foundPost.likes.forEach((like) => {
      if (req.user.id === like.id) {
        isLiked = true
      }
    })

    if (isLiked) {
      return sendMessageResponse(res, 400, 'You already liked this post')
    }

    const likedPost = await foundPost.createLike(req.user.id)

    sendDataResponse(res, 200, { post: likedPost })
  } catch (error) {
    sendMessageResponse(res, 400, `Unable to like post: ${error}`)
  }
}

export const deleteLike = async (req, res) => {
  const postId = Number(req.params.postId)
  const userId = Number(req.params.userId)

  try {
    const foundPost = await Post.findById(postId)

    if (!foundPost) {
      return sendDataResponse(res, 404, {
        error: 'Post with given id not found'
      })
    }

    const foundUser = await User.findById(userId)

    if (!foundUser) {
      return sendDataResponse(res, 404, {
        error: 'User with given id not found'
      })
    }

    if (req.user.id !== userId) {
      return sendDataResponse(res, 404, {
        error: "You cannot delete someone else's like"
      })
    }

    let wasLiked = false
    foundPost.likes.forEach((like) => {
      if (like.id === userId) {
        wasLiked = true
      }
    })

    if (!wasLiked) {
      return sendMessageResponse(res, 404, 'The user has not liked this post')
    }

    await foundPost.deleteLike(userId)

    res.status(200).json({ status: 'success' })
  } catch (error) {
    console.error(error)
    sendMessageResponse(res, 400, `Unable to delete like on post: ${error}`)
  }
}

export const getAllLikes = async (req, res) => {
  const id = Number(req.params.id)

  try {
    const foundPost = await Post.findById(id)

    if (!foundPost) {
      return sendDataResponse(res, 404, {
        error: 'Post with given id not found'
      })
    }

    sendDataResponse(res, 200, { post: foundPost })
  } catch (error) {
    sendMessageResponse(res, 400, `Unable to get likes ${error}`)
  }
}
export const createCommentLike = async (req, res) => {
  const postId = Number(req.params.postId)
  const commentId = Number(req.params.commentId)

  try {
    const foundPost = await Post.findById(postId)

    if (!foundPost) {

      return sendDataResponse(res, 404, {
        error: 'Post with given id not found'
      })
    }
     const foundComment = await Comment.findById(commentId)

     if (!foundComment) {
       return sendDataResponse(res, 404, {
         error: 'Comment with given id, not found!'
       })
     }
     let isLiked = false
     foundComment.likes.forEach((like) => {
       if (req.user.id === like.id) {
         isLiked = true
       }
     })

     if (isLiked) {
       return sendMessageResponse(res, 400, 'You already liked this comment')
     }
    const likedComment = await foundComment.createCommentLike(req.user.id)
    // console.log(likedComment)
    sendDataResponse(res, 200, { comment: likedComment })


  } catch (error) {
    console.error(error)
  }
}