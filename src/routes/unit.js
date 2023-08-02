import { Router } from 'express'
import { getAll } from '../controllers/modules.js'
import { validateAuthentication } from '../middleware/auth.js'

const router = Router()
router.get('/:id', validateAuthentication, getAll)
export default router
