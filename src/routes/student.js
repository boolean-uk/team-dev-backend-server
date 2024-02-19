import { Router } from 'express'
import { getAllStudents } from '../controllers/student'
import { validateAuthentication } from '../middleware/auth'

const router = Router()

router.get('/', validateAuthentication, getAllStudents)

export default router
