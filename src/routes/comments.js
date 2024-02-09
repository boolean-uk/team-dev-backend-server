import { Router } from 'express'
import { createComment } from '../controllers/comments.js'

const router = Router()

router.post('/', createComment)

export default router
