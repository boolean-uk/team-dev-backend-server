import { Router } from 'express'
import { addModule, getAll, updateModule } from '../controllers/modules.js'
import {
  validateAuthentication,
  validateTeacherRole
} from '../middleware/auth.js'

const router = Router()
router.post('/', validateAuthentication, validateTeacherRole, addModule)
router.get('/:id', validateAuthentication, getAll)
router.put('/:id', validateAuthentication, validateTeacherRole, updateModule)
export default router
