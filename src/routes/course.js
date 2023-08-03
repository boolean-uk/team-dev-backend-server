import { Router } from 'express'
import {
  validateAuthentication,
  validateTeacherRole
} from '../middleware/auth.js'
import { addCourse } from '../controllers/courses.js'

const router = Router()

router.post('/', validateAuthentication, validateTeacherRole, addCourse)

export default router
