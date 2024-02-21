import Post from '../domain/post.js'
import errorCreator from '../helpers/errorCreator.js'

export const postExist = async (req, res, next) => {
  const { postId } = req.params

  try {
    const post = await Post.getById(postId)

    if (!post) {
      throw errorCreator('Post not found', 404)
    }

    const postData = {
      id: post.id,
      userId: post.userId
    }

    req.post = postData

    next()
  } catch (err) {
    next(err)
  }
}

export const checkPostOwner = async (req, res, next) => {
  const postUserId = req.post.userId
  const userId = req.user.id
  const userRole = req.user.role

  console.log(postUserId, userId, userRole)

  try {
    if (userRole === 'TEACHER') {
      return next()
    }

    if (postUserId !== userId) {
      throw errorCreator('You are not authorized to delete this post', 403)
    }

    next()
  } catch (err) {
    next(err)
  }
}
