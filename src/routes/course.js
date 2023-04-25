import { Router } from 'express'
import { create, getAll, getById } from '../controllers/course.js'
import {
  validateAuthentication,
  validateTeacherRole
} from '../middleware/auth.js'

const router = Router()

router.get('/', validateAuthentication, getAll)
router.get('/:id', validateAuthentication, getById)
router.post('/', validateAuthentication, validateTeacherRole, create)

export default router
