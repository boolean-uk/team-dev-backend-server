import { Router } from 'express'
import { create, getAll, deletePost, editPost } from '../controllers/post.js'
import { validateAuthentication } from '../middleware/auth.js'

const router = Router()

router.post('/', validateAuthentication, create)
router.get('/', validateAuthentication, getAll)
router.put('/:postId', validateAuthentication, editPost)
router.delete('/:postId', validateAuthentication, deletePost)

export default router
