import { sendDataResponse } from '../utils/responses.js'
import { createNote } from '../domain/note.js'

export const create = async (req, res) => {
  const { content, userId } = req.body

  if (!content) {
    return sendDataResponse(res, 400, {
      content: 'Please provide content in your notes immediatley!'
    })
  }
  try {
    const newNote = await createNote(userId, content)
    console.log('this is newNote: ', newNote)
    return sendDataResponse(res, 201, { note: newNote })
  } catch (error) {
    return sendDataResponse(res, 400, {
      content: 'Please provide content in your notes immediatley!'
    })
  }
}
