import { Router } from 'express'
import {
  create,
  getCohorts,
  getStudentsByCohortId,
  changeStudentCohort
} from '../controllers/cohort.js'
import {
  validateAuthentication,
  validateTeacherRole
} from '../middleware/auth.js'

const router = Router()

router.post('/', validateAuthentication, validateTeacherRole, create)
router.get('/', validateAuthentication, validateTeacherRole, getCohorts)
router.get('/:id/students', validateAuthentication, getStudentsByCohortId)
router.put(
  '/:id/students',
  validateAuthentication,
  validateTeacherRole,
  changeStudentCohort
)

export default router
