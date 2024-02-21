import { Router } from 'express'

import {
  validateAuthentication,
  validateTeacherRole
} from '../middleware/auth.js'
import { createNote } from '../controllers/note.js'
import { checkFields } from '../middleware/commentErrors.js'

const router = Router()

router.post(
  '/',
  validateAuthentication,
  validateTeacherRole,
  checkFields(['title', 'content', 'studentUserId', 'teacherUserId']),
  createNote
)

export default router
