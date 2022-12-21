import { Router } from 'express'
import { create, getPost, getAll } from '../controllers/post.js'
import { validateAuthentication } from '../middleware/auth.js'
import {
  getComment,
  createComment,
  replyToComment
} from '../controllers/comment.js'
import { likePost, likeComment } from '../controllers/like.js'

const router = Router()

router.post('/', validateAuthentication, create)
router.get('/', validateAuthentication, getAll)
router.get('/:postId', validateAuthentication, getPost)
router.get('/:postId/comments/:commentId', validateAuthentication, getComment)
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
