import { Router } from 'express'
import { create, get, getAll, getbyID } from '../controllers/cohort.js'

import {
  validateAuthentication,
  validateTeacherRole
} from '../middleware/auth.js'

const router = Router()

router.post('/', validateAuthentication, validateTeacherRole, create)
router.get('/:id', validateAuthentication, getbyID)
router.get('/:id', validateAuthentication, validateTeacherRole, get)
router.get('/', validateAuthentication, validateTeacherRole, getAll)

export default router
