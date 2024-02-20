import { Router } from 'express'
import { getAllStudents } from '../controllers/student.js'
import { validateAuthentication } from '../middleware/auth.js'

const router = Router()

router.get('/', validateAuthentication, getAllStudents)

export default router
