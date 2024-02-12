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
