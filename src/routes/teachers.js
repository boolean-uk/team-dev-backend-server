import { Router } from 'express'
import { getAllTeachers, getTeacher } from '../controllers/teachers.js'
import { validateAuthentication } from '../middleware/auth.js'

const router = Router()

router.get('/', validateAuthentication, getAllTeachers)
router.get('/:id', validateAuthentication, getTeacher)

export default router
