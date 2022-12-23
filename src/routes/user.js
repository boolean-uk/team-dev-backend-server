import { Router } from 'express'
import {
  create,
  getById,
  getAll,
  updateUserCohortById,
  updateUserById
} from '../controllers/user.js'
import {
  validateAuthentication,
  validateTeacherRole
} from '../middleware/auth.js'

const router = Router()

router.post('/', create)
router.get('/', validateAuthentication, getAll)
router.get('/:id', validateAuthentication, getById)
router.patch(
  '/:id/cohort',
  validateAuthentication,
  validateTeacherRole,
  updateUserCohortById
)
router.patch('/:id/profile', validateAuthentication, updateUserById)

export default router
