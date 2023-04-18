import { Router } from 'express'
import { create, update } from '../controllers/deliveryLog.js'
import {
  validateAuthentication,
  validateTeacherRole
} from '../middleware/auth.js'

const router = Router()

router.post('/', validateAuthentication, validateTeacherRole, create)
router.patch('/:id', validateAuthentication, validateTeacherRole, update)

export default router
