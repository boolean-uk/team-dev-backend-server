import { Router } from 'express'
import { create, getAll, editPost } from '../controllers/post.js'
import { validateAuthentication } from '../middleware/auth.js'
import { createComment, removeComment } from '../controllers/comment.js'
import { togglePostLike, toggleCommentLike } from '../controllers/like.js'

const router = Router()

router.post('/', validateAuthentication, create)
router.get('/', validateAuthentication, getAll)
router.post('/:postId/comments', validateAuthentication, createComment)
router.delete('/:postId/comments', validateAuthentication, removeComment)
router.post('/:postId/like', validateAuthentication, togglePostLike)
router.post(
  '/comments/:commentId/like',
  validateAuthentication,
  toggleCommentLike
)
router.put('/:id', validateAuthentication, editPost)

export default router
