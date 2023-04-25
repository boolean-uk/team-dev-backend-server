import { Router } from 'express'
import { getAllCourses } from '../controllers/course.js'
import { validateAuthentication } from '../middleware/auth.js'

const router = Router()

router.get('/', validateAuthentication, getAllCourses)

export default router
