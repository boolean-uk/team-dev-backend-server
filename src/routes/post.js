import { Router } from 'express'
import {
  create,
  getAll,
  deletePost,
  editPost,
  likePost
} from '../controllers/post.js'
import { validateAuthentication } from '../middleware/auth.js'
import { postExist } from '../middleware/postError.js'

const router = Router()

router.post('/', validateAuthentication, create)
router.post('/:postId/like', validateAuthentication, likePost)
router.get('/', validateAuthentication, getAll)
router.put('/:postId', validateAuthentication, editPost)
router.delete('/:postId', postExist, deletePost)

export default router
