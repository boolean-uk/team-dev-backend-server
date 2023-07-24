import { Router } from 'express'
import { create } from '../controllers/note.js'
import { validateAuthentication } from '../middleware/auth.js'

const router = Router()

router.post('/', validateAuthentication, create)

export default router
