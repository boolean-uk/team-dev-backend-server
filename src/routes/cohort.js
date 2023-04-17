import { Router } from 'express'
import { create, getAllCohorts, getStudents } from '../controllers/cohort.js'
import {
  validateAuthentication,
  validateTeacherRole
} from '../middleware/auth.js'

const router = Router()

router.post('/', validateAuthentication, validateTeacherRole, create)
router.get('/', validateAuthentication, validateTeacherRole, getAllCohorts)
router.get('/:id/users', validateAuthentication, getStudents)

export default router
