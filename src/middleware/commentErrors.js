const errorCreator = (message, status) => {
  const error = new Error(message)
  error.status = status
  return error
}

export const checkFields = (req, res, next) => {
  const fields = req.body
  const requiredFields = ['postId', 'content']

  requiredFields.forEach((field) => {
    if (!fields[field]) {
      throw errorCreator(`Missing field: ${field}`, 400)
    }
  })

  next()
}
