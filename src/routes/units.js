import { Router } from 'express'
import { validateAuthentication } from '../middleware/auth.js'
import { getAllByUnit } from '../controllers/exercises.js'
const router = Router()

router.get('/:id/exercises', validateAuthentication, getAllByUnit)

export default router
