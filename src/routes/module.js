import { Router } from 'express'
import { getAll, getById } from '../controllers/module.js'
import { validateAuthentication } from '../middleware/auth.js'

const router = Router()

router.get('/:id', validateAuthentication, getById)
router.get('/', validateAuthentication, getAll)

export default router
