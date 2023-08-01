import { Router } from 'express'
import {
  validateAuthentication,
  validateTeacherRole
} from '../middleware/auth.js'
import { addUnit } from '../controllers/units.js'

const router = Router()

router.post('/', validateAuthentication, validateTeacherRole, addUnit)

export default router
