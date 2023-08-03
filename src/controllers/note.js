import { sendDataResponse, sendErrorResponse } from '../utils/responses.js'
import { createNote } from '../domain/note.js'
import User from '../domain/user.js'

const validateCreateNoteFunctionInputs = (req) => {
  const { content, userId } = req.body
  const keys = Object.keys(req.body)
  const invalidKeys = keys.find((key) => {
    return key !== 'content' && key !== 'userId'
  })
  if (invalidKeys) {
    return { Error: 'Invalid key provided!' }
  }
  if (keys.includes('content') && typeof req.body.content !== 'string') {
    return { Error: 'Content must be a string!' }
  }
  if (keys.includes('userId') && typeof req.body.userId !== 'number') {
    return { Error: 'userId must be a number!' }
  }
  if (!keys[0]) {
    return { Error: 'No data provided.' }
  }
  if (!content) {
    return { Error: 'Please provide content in your notes immediatley!' }
  }
  if (!userId) {
    return { Error: 'Please provide userId immediatley!' }
  }
  const targetUser = User._findByUnique('id', userId)
  if (targetUser.role === 'TEACHER') {
    return { Error: 'Can not add notes on teachers.' }
  }
  return null
}

export const create = async (req, res) => {
  const { content, userId } = req.body
  const validationError = validateCreateNoteFunctionInputs(req, res)
  if (validationError) {
    return sendErrorResponse(res, 400, validationError.Error)
  }
  if (req.user.role !== 'TEACHER') {
    return sendErrorResponse(res, 403, 'Permission denied!')
  }
  try {
    const newNote = await createNote(userId, content)
    return sendDataResponse(res, 201, { note: newNote })
  } catch (error) {
    return sendErrorResponse(res, 500, 'Unexpected Error!')
  }
}
