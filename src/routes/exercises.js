import { Router } from 'express'
import {
  validateAuthentication,
  validateTeacherRole
} from '../middleware/auth.js'
import {
  getById,
  addExercise,
  updateExercise
} from '../controllers/exercises.js'
const router = Router()

router.get('/:id', validateAuthentication, validateTeacherRole, getById)

router.post('/', validateAuthentication, validateTeacherRole, addExercise)
router.put('/:id', validateAuthentication, validateTeacherRole, updateExercise)
export default router
