import { Router } from 'express'
import { create, getAll } from '../controllers/post.js'
import { validateAuthentication } from '../middleware/auth.js'
import { createComment, replyToComment } from '../controllers/comment.js'
import { likePost, likeComment } from '../controllers/like.js'

const router = Router()

router.post('/', validateAuthentication, create)
router.get('/', validateAuthentication, getAll)
router.post('/:postId/comments', validateAuthentication, createComment)
router.post(
  '/:postId/comments/:commentId',
  validateAuthentication,
  replyToComment
)
router.post('/:postId/like', validateAuthentication, likePost)
router.post(
  '/:postId/comments/:commentId/like',
  validateAuthentication,
  likeComment
)

export default router
