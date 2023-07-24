import { sendDataResponse } from '../utils/responses.js'
import { createNote } from '../domain/note.js'
import User from '../domain/user.js'

export const create = async (req, res) => {
  const { content, userId } = req.body
  const targetUser = await User._findByUnique('id', userId)

  if (!content) {
    return sendDataResponse(res, 400, {
      content: 'Please provide content in your notes immediatley!'
    })
  }
  if (targetUser.role === 'TEACHER') {
    return sendDataResponse(res, 400, {
      content: 'Can not add notes on teachers.'
    })
  }
  try {
    const newNote = await createNote(userId, content)
    return sendDataResponse(res, 201, { note: newNote })
  } catch (error) {
    return sendDataResponse(res, 400, {
      content: 'Please provide content in your notes immediatley!'
    })
  }
}
