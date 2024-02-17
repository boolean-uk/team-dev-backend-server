import { Router } from 'express'
import { getAllTeachers } from '../controllers/teachers.js'
import { validateAuthentication } from '../middleware/auth.js'

const router = Router()

router.get('/', validateAuthentication, getAllTeachers)

export default router
