import { Router } from 'express'
import { getAllStudents, getSelf } from '../controllers/student.js'
import {
  validateAuthentication,
  validateStudentRole
} from '../middleware/auth.js'

const router = Router()

router.get('/', validateAuthentication, getAllStudents)
router.get('/me', validateAuthentication, validateStudentRole, getSelf)

export default router
