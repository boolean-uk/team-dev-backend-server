import { Router } from 'express'
import { create, remove } from '../controllers/comment.js'
import { validateAuthentication } from '../middleware/auth.js'

const router = Router()

router.post('/', validateAuthentication, create)
router.delete('/', validateAuthentication, remove)

export default router
