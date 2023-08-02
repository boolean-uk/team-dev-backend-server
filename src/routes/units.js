import { Router } from 'express'
import {
  validateAuthentication,
  validateTeacherRole
} from '../middleware/auth.js'
import { addUnit, getAll } from '../controllers/units.js'

const router = Router()

router.post('/', validateAuthentication, validateTeacherRole, addUnit)
router.get('/:id', validateAuthentication, getAll)

export default router
