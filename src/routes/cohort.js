import { Router } from 'express'
import { create, getAll, getById, deleteById } from '../controllers/cohort.js'
import {
  validateAuthentication,
  validateTeacherRole
} from '../middleware/auth.js'

const router = Router()

router.post('/', validateAuthentication, validateTeacherRole, create)
router.get('/', validateAuthentication, validateTeacherRole, getAll)
router.get('/:id', validateAuthentication, validateTeacherRole, getById)
router.delete('/:id', validateAuthentication, validateTeacherRole, deleteById)

export default router
