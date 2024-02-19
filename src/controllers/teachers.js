import Teacher from '../domain/teachers.js'
import { sendDataResponse } from '../utils/responses.js'

export const getAllTeachers = async (req, res) => {
  const teachers = await Teacher.getAll()

  return sendDataResponse(res, 200, { teachers })
}
