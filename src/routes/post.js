import { Router } from 'express'
import { create, getAll } from '../controllers/post.js'
import { createComment } from '../controllers/comment.js'
import { validateAuthentication } from '../middleware/auth.js'

const router = Router()

router.post('/', validateAuthentication, create)
router.get('/', validateAuthentication, getAll)

router.post('/:id/comments', validateAuthentication, createComment)

export default router
