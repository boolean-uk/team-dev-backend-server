import { Router } from 'express'
import {
  create,
  getById,
  getSelf,
  getAll,
  updateById,
  createProfile
} from '../controllers/user.js'
import {
  validateAuthentication,
  validateTeacherRole
} from '../middleware/auth.js'

const router = Router()

router.post('/', create)
router.get('/', validateAuthentication, getAll)
router.get('/me', validateAuthentication, getSelf)
router.get('/:id', validateAuthentication, getById)
router.patch('/:id', validateAuthentication, validateTeacherRole, updateById)
router.put('/:id', validateAuthentication, createProfile)

export default router
