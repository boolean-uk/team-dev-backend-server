import { Router } from 'express'
import { create, getAll, edit } from '../controllers/post.js'
import { validateAuthentication } from '../middleware/auth.js'
import { createComment, replyToComment } from '../controllers/comment.js'

const router = Router()

router.post('/', validateAuthentication, create)
router.get('/', validateAuthentication, getAll)
router.post('/:postId/comments', validateAuthentication, createComment)
router.post(
  '/:postId/comments/:commentId',
  validateAuthentication,
  replyToComment
)
router.put('/:postId', validateAuthentication, edit)

export default router
