import { Router } from 'express'
import { create, getAll } from '../controllers/post.js'
import { validateAuthentication } from '../middleware/auth.js'
import { createComment } from '../controllers/comment.js'
import { togglePostLike } from '../controllers/like.js'

const router = Router()

router.post('/', validateAuthentication, create)
router.get('/', validateAuthentication, getAll)
router.post('/:postId/comments', validateAuthentication, createComment)
router.post('/:postId/like', validateAuthentication, togglePostLike)

export default router
