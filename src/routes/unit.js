import { Router } from 'express'
import { validateAuthentication } from '../middleware/auth.js'
import { getUnitById, getUnitsByModule } from '../controllers/unit.js'
const router = Router()

router.get('/:unitId', validateAuthentication, getUnitById)

router.get('/modules/:moduleId/', validateAuthentication, getUnitsByModule)

export default router
