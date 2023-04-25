import { Router } from 'express'
import { getAll } from '../controllers/module.js'
import { validateAuthentication } from '../middleware/auth.js'

const router = Router()

router.get('/', validateAuthentication, getAll)

export default router
