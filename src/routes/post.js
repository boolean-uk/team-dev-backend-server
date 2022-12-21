import { Router } from 'express'
import {
  create,
  getPost,
  getAll,
  edit,
  deletePost
} from '../controllers/post.js'
import { validateAuthentication } from '../middleware/auth.js'
import { createComment, replyToComment } from '../controllers/comment.js'
import { likePost, likeComment } from '../controllers/like.js'

const router = Router()

router.post('/', validateAuthentication, create)
router.get('/', validateAuthentication, getAll)
router.get('/:postId', validateAuthentication, getPost)
router.post('/:postId/comments', validateAuthentication, createComment)
router.post(
  '/:postId/comments/:commentId',
  validateAuthentication,
  replyToComment
)
router.put('/:postId', validateAuthentication, edit)
router.delete('/:postId', validateAuthentication, deletePost)
router.post('/:postId/like', validateAuthentication, likePost)
router.post(
  '/:postId/comments/:commentId/like',
  validateAuthentication,
  likeComment
)

export default router
