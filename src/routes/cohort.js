import { Router } from 'express'
import {
  create,
  getAll,
  deleteCohortById,
  getById
} from '../controllers/cohort.js'
import {
  validateAuthentication,
  validateTeacherRole
} from '../middleware/auth.js'

const router = Router()

router.post('/', validateAuthentication, validateTeacherRole, create)
router.get('/', validateAuthentication, validateTeacherRole, getAll)
router.get('/:id', validateAuthentication, getById)

router.delete(
  '/:id',
  validateAuthentication,
  validateTeacherRole,
  deleteCohortById
)

export default router
