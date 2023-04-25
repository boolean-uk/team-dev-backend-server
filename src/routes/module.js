import { Router } from 'express'
import { getById } from '../controllers/module.js'
import { validateAuthentication } from '../middleware/auth.js'

const router = Router()

router.get('/:id', validateAuthentication, getById)

export default router
