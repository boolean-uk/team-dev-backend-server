import Post from '../domain/post.js'

const errorCreator = (message, status) => {
  const error = new Error(message)
  error.status = status
  return error
}

export const checkFields = (requiredFields) => {
  return (req, res, next) => {
    const fields = req.body

    requiredFields.forEach((field) => {
      if (!fields[field]) {
        throw errorCreator(`Missing field: ${field}`, 400)
      }
    })

    next()
  }
}

export const checkPostExist = async (req, res, next) => {
  const { postId } = req.params

  try {
    const foundPost = await Post.getById(postId)

    if (!foundPost) {
      throw errorCreator(`Post with provided id ${postId} does not exist`, 404)
    }

    next()
  } catch (err) {
    next(err)
  }
}
