import { Router } from 'express'
import {
  validateAuthentication,
  validateTeacherRole
} from '../middleware/auth.js'
import { createUnit } from '../controllers/note.js'

const router = Router()

router.post('/', validateAuthentication, validateTeacherRole, createUnit)

export default router
