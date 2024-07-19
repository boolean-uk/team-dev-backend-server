import { Router } from 'express'
import { createDeliveryLog } from '../controllers/deliveryLog.js'
import {
  validateAuthentication,
  validateTeacherRole
} from '../middleware/auth.js'

const router = Router()

router.post('/', validateAuthentication, validateTeacherRole, createDeliveryLog)

export default router
