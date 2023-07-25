import { Router } from 'express'
import { create } from '../controllers/deliveryLog.js'
import {
  validateAuthentication,
  validateTeacherRole
} from '../middleware/auth.js'

const router = Router()

router.post('/', validateAuthentication, validateTeacherRole, create)
// router.get('/:id', validateAuthentication, validateTeacherRole, getLogs)

export default router
