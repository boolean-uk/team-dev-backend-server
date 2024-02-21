import Post from '../domain/post.js'
import errorCreator from '../helpers/errorCreator.js'

export const postExist = async (req, res, next) => {
  const { postId } = req.params

  const post = await Post.getById(postId)

  try {
    if (!post) {
      throw errorCreator('Post not found', 404)
    }
  } catch (err) {
    next(err)
  }

  const postData = {
    id: post.id,
    userId: post.userId
  }

  req.post = postData

  next()
}

export const checkPostOwner = async (req, res, next) => {
  const postUserId = req.post.userId
  const userId = req.user.id
  const userRole = req.user.role

  try {
    if (postUserId !== userId && userRole !== 'TEACHER') {
      throw errorCreator('You are not authorized to delete this post', 403)
    }
  } catch (err) {
    next(err)
  }

  next()
}
