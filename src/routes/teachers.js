import { Router } from 'express'
import { getAllTeachers } from '../controllers/teachers.js'

const router = Router()

router.get('/', getAllTeachers)

export default router
