import Post from '../domain/post.js'
import Comment from '../domain/comment.js'
import { sendMessageResponse } from '../utils/responses.js'

export const likePost = async (req, res) => {
  try {
    const { id } = req.user
    const { postId } = req.params
    const foundPost = await Post.findPost(postId)

    if (!foundPost) {
      return sendMessageResponse(res, 400, 'post not found')
    }
    const isLikedAlready = await Post.isLiked(postId, id)

    if (isLikedAlready) {
      const unlikedPost = await Post.unlike(postId, id)
      delete unlikedPost.commentId
      return res.status(201).json({ unlikedPost })
    }

    const likedPost = await Post.likeAPost(foundPost, id)
    delete likedPost.commentId
    res.status(201).json({ likedPost })
  } catch (e) {
    console.error(e)
    return sendMessageResponse(res, 500, 'Something went wrong.')
  }
}

export const likeComment = async (req, res) => {
  try {
    const { id } = req.user
    const { commentId } = req.params

    const foundComment = await Comment.findComment(commentId)

    if (!foundComment) {
      return sendMessageResponse(res, 400, 'comment not found')
    }

    const isLikedAlready = await Comment.isLiked(commentId, id)

    if (isLikedAlready) {
      const unlikedComment = await Comment.unlike(commentId, id)
      delete unlikedComment.commentId
      return res.status(201).json({ unlikedComment })
    }

    const likedComment = await Comment.likeAComment(foundComment, id)
    delete likedComment.commentId

    res.status(201).json({ likedComment })
  } catch (e) {
    console.error(e)
    return sendMessageResponse(res, 500, 'Something went wrong.')
  }
}
