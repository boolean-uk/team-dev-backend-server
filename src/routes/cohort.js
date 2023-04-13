import { Router } from 'express'
import { create, getStudents } from '../controllers/cohort.js'
import {
  validateAuthentication,
  validateTeacherRole
} from '../middleware/auth.js'

const router = Router()

router.post('/', validateAuthentication, validateTeacherRole, create)
router.get('/cohort/:id/users', validateAuthentication, getStudents)

export default router
