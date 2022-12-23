import { Router } from 'express'
import {
  create,
  getById,
  getAll,
  updateCohortById,
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
router.put(
  '/:id',
  validateAuthentication,
  validateTeacherRole,
  updateCohortById
)
router.patch('/:id', validateAuthentication, updateUserById)

export default router
