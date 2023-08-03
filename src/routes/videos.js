import { Router } from 'express'
import { getVideos } from '../controllers/videos.js'

import { validateAuthentication } from '../middleware/auth.js'

const router = Router()

router.get('/', validateAuthentication, getVideos)

export default router
