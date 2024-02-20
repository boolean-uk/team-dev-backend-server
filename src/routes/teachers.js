import { Router } from 'express'
import { getAllTeachers, getSelf, getTeacher } from '../controllers/teachers.js'
import {
  validateAuthentication,
  validateTeacherRole
} from '../middleware/auth.js'

const router = Router()

router.get('/', validateAuthentication, getAllTeachers)
router.get('/me', validateAuthentication, validateTeacherRole, getSelf)
router.get('/:id', validateAuthentication, getTeacher)

export default router
