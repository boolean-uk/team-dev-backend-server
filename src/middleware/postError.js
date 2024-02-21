import Post from '../domain/post.js'
import errorCreator from '../helpers/errorCreator.js'

export const postExist = async (req, res, next) => {
  const { postId } = req.params

  try {
    const post = await Post.getById(postId)

    if (!post) {
      throw errorCreator('Post not found', 404)
    }

    next()
  } catch (err) {
    next(err)
  }
}
