import { emailRegex, passwordRegex } from './regexMatchers.js'
import ERR from './errors.js'

export function register(email, password) {
  if (!email) {
    throw Error(ERR.EMAIL_REQUIRED)
  }

  if (!password) {
    throw Error(ERR.PASSWORD_REQUIRED)
  }

  if (!email.match(emailRegex)) {
    throw Error(ERR.EMAIL_FORMATING)
  }

  if (!password.match(passwordRegex)) {
    throw Error(ERR.PASSWORD_REQUIREMENTS)
  }
}

export function validateCanModify(req) {
  const { role, id } = req.user
  const targetUserId = Number(req.params.id)
  const isUser = id === targetUserId
  const isTeacher = role === 'TEACHER'

  if (!isTeacher && !isUser) {
    return false
  }
  return true
}
