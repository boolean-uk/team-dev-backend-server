import { sendDataResponse, sendMessageResponse } from '../utils/responses.js'
import { JWT_SECRET } from '../utils/config.js'
import jwt from 'jsonwebtoken'
import User from '../domain/user.js'
import Teacher from '../domain/teachers.js'
import Student from '../domain/student.js'

export async function validateTeacherRole(req, res, next) {
  if (!req.user) {
    return sendMessageResponse(res, 500, 'Unable to verify user')
  }

  if (req.user.role !== 'TEACHER') {
    return sendDataResponse(res, 403, {
      authorization: 'You are not authorized to perform this action'
    })
  }

  next()
}

export async function validateStudentRole(req, res, next) {
  if (!req.user) {
    return sendMessageResponse(res, 500, 'Unable to verify user')
  }

  if (req.user.role !== 'STUDENT') {
    return sendDataResponse(res, 403, {
      authorization: 'You are not authorized to perform this action'
    })
  }

  next()
}

export async function validateAuthentication(req, res, next) {
  const header = req.header('authorization')

  if (!header) {
    return sendDataResponse(res, 401, {
      authorization: 'Missing Authorization header'
    })
  }

  const [type, token] = header.split(' ')

  const isTypeValid = validateTokenType(type)
  if (!isTypeValid) {
    return sendDataResponse(res, 401, {
      authentication: `Invalid token type, expected Bearer but got ${type}`
    })
  }

  const isTokenValid = validateToken(token)
  if (!isTokenValid) {
    return sendDataResponse(res, 401, {
      authentication: 'Invalid or missing access token'
    })
  }

  const decodedToken = jwt.decode(token)
  const foundUser = await User.findById(decodedToken.userId)
  delete foundUser.passwordHash

  req.user = foundUser

  if (decodedToken.userRole === 'TEACHER') {
    const foundTeacher = await Teacher.findByUserId(decodedToken.userId)
    req.teacher = foundTeacher
  }
  if (decodedToken.userRole === 'STUDENT') {
    const foundStudent = await Student.findByUserId(decodedToken.userId)
    req.student = foundStudent
  }

  next()
}

function validateToken(token) {
  if (!token) {
    return false
  }

  return jwt.verify(token, JWT_SECRET, (error) => {
    return !error
  })
}

function validateTokenType(type) {
  if (!type) {
    return false
  }

  if (type.toUpperCase() !== 'BEARER') {
    return false
  }

  return true
}
