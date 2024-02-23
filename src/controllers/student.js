import Student from '../domain/student.js'
import { sendDataResponse } from '../utils/responses.js'

export const getAllStudents = async (req, res) => {
  const students = await Student.getAll()

  return sendDataResponse(res, 200, { students })
}

export const getSelf = async (req, res) => res.json({ data: req.student })
