import { Router } from 'express'
import { create, getAll, get, addUser } from '../controllers/cohort.js'
import { getVideosByCohort } from '../controllers/videos.js'

import {
  validateAuthentication,
  validateTeacherRole
} from '../middleware/auth.js'

const router = Router()

router.post('/', validateAuthentication, validateTeacherRole, create)
router.post('/user/add', validateAuthentication, validateTeacherRole, addUser)

router.get('/:id', validateAuthentication, get)
router.get('/', validateAuthentication, validateTeacherRole, getAll)

router.get('/:id/videos', validateAuthentication, getVideosByCohort)

export default router
