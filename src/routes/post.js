import { Router } from 'express'
import { create, getAll, getPostByID } from '../controllers/post.js'
import { validateAuthentication } from '../middleware/auth.js'

const router = Router()

router.post('/', validateAuthentication, create)
router.get('/', validateAuthentication, getAll)
router.get('/:id', validateAuthentication, getPostByID)

export default router
