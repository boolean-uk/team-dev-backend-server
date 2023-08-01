import { Router } from 'express'
import {
  validateAuthentication,
  validateTeacherRole
} from '../middleware/auth.js'
import { getById } from '../controllers/exercises.js'
const router = Router()

router.get('/:id', validateAuthentication, validateTeacherRole, getById)

export default router
