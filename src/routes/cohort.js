import { Router } from 'express'
import { create, get, getStudents } from '../controllers/cohort.js'
import {
  validateAuthentication,
  validateTeacherRole
} from '../middleware/auth.js'

const router = Router()

router.post('/', validateAuthentication, validateTeacherRole, create)
router.get('/', validateAuthentication, validateTeacherRole, get)
router.get('/:id/users', validateAuthentication, getStudents)

export default router
