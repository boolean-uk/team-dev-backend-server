import Post from '../domain/post.js'
import Comment from '../domain/comment.js'

export const likePost = async (req, res) => {
  const { id } = req.user
  const { postId } = req.params
  const foundPost = await Post.findPost(postId)
  const isLikedAlready = await Post.isLiked(postId, id)

  if (isLikedAlready.length) {
    const unLikedPost = await Post.unlike(isLikedAlready)
    delete unLikedPost.commentId
    return res.status(201).json({ unLikedPost })
  }

  const likedPost = await Post.likeAPost(foundPost, id)
  delete likedPost.commentId

  res.status(201).json({ likedPost })
}

export const likeComment = async (req, res) => {
  const { id } = req.user
  const { commentId } = req.params

  const foundComment = await Comment.findComment(commentId)

  const isLikedAlready = await Comment.isLiked(commentId, id)

  if (isLikedAlready.length) {
    const unLikedComment = await Comment.unlike(isLikedAlready)
    delete unLikedComment.commentId
    return res.status(201).json({ unLikedComment })
  }

  const likedComment = await Comment.likeAComment(foundComment, id)

  res.status(201).json({ likedComment })
}
