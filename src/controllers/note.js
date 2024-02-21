import Note from '../domain/note.js'
import Student from '../domain/student.js'
import Teacher from '../domain/teachers.js'

import { sendDataResponse } from '../utils/responses.js'

export const createNote = async (req, res) => {
  const { title, content, studentUserId, teacherUserId } = req.body

  try {
    await Student.findByUserId(studentUserId)
  } catch (error) {
    return sendDataResponse(res, 400, {
      error: 'Student not found',
      status: 400
    })
  }

  try {
    await Teacher.findByUserId(teacherUserId)
  } catch (error) {
    return sendDataResponse(res, 400, {
      error: 'Teacher not found',
      status: 400
    })
  }

  try {
    const createdNote = await Note.create(
      title,
      content,
      studentUserId,
      teacherUserId
    )

    return sendDataResponse(res, 201, createdNote)
  } catch (error) {
    console.error('Error creating note:', error)
    return sendDataResponse(res, 500, { error: 'Something went wrong' })
  }
}
