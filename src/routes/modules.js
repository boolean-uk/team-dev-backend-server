import { Router } from 'express'
import { addModule } from '../controllers/modules.js'
import {
  validateAuthentication,
  validateTeacherRole
} from '../middleware/auth.js'

const router = Router()
router.post('/', validateAuthentication, validateTeacherRole, addModule)

export default router
