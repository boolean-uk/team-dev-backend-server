import Teacher from '../domain/teachers.js'
import { sendDataResponse } from '../utils/responses.js'

export const getAllTeachers = async (req, res) => {
  const teachers = await Teacher.getAll()

  return sendDataResponse(res, 200, { teachers })
}

export const getTeacher = async (req, res) => {
  const id = Number(req.params.id)
  const teacher = await Teacher.getTeacherBy(id)
  return sendDataResponse(res, 200, { teacher })
}

export const getSelf = async (req, res) => res.json({ data: req.teacher })
