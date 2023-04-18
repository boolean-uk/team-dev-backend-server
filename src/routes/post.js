import { Router } from 'express'
import { create, getAll, getById, updateById } from '../controllers/post.js'
import { createComment } from '../controllers/comment.js'
import { validateAuthentication, validateIdOrRole } from '../middleware/auth.js'

const router = Router()

router.post('/', validateAuthentication, create)
router.get('/', validateAuthentication, getAll)
router.post('/:id/comments', validateAuthentication, createComment)
router.get('/:id', validateAuthentication, getById)
router.patch('/:id', validateAuthentication, validateIdOrRole, updateById)

export default router
