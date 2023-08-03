import { Router } from 'express'
import {
  validateAuthentication,
  validateTeacherRole
} from '../middleware/auth.js'
import { getById, addExercise } from '../controllers/exercises.js'
const router = Router()

router.get('/:id', validateAuthentication, validateTeacherRole, getById)

router.post('/', validateAuthentication, validateTeacherRole, addExercise)
export default router
