import { Router } from 'express'
import {
  create,
  getAll,
  getById,
  updateById,
  deleteById
} from '../controllers/cohort.js'
import {
  validateAuthentication,
  validateTeacherRole
} from '../middleware/auth.js'

const router = Router()

router.post('/', validateAuthentication, validateTeacherRole, create)
router.get('/', validateAuthentication, getAll)
router.get('/:id', validateAuthentication, getById)
router.patch('/:id', validateAuthentication, updateById)
router.delete('/:id', validateAuthentication, deleteById)

export default router
