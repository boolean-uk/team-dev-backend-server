import { Router } from 'express'
import {
  validateAuthentication,
  validateTeacherRole
} from '../middleware/auth.js'
import { addUnit, getAll, updateUnit } from '../controllers/units.js'

const router = Router()

router.post('/', validateAuthentication, validateTeacherRole, addUnit)
router.get('/:id', validateAuthentication, getAll)
router.put('/:id', validateAuthentication, validateTeacherRole, updateUnit)

export default router
