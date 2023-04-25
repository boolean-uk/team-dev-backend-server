import { Router } from 'express'
import { create, getAll, getById } from '../controllers/course.js'
import { getAllModulesByCourse } from '../controllers/module.js'
import {
  validateAuthentication,
  validateTeacherRole
} from '../middleware/auth.js'

const router = Router()

router.get('/', validateAuthentication, getAll)
router.get('/:id', validateAuthentication, getById)
router.get('/:id/modules', validateAuthentication, getAllModulesByCourse)
router.post('/', validateAuthentication, validateTeacherRole, create)

export default router
