const errorCreator = (message, status) => {
  const error = new Error(message)
  error.status = status
  return error
}

export default errorCreator
