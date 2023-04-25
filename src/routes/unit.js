import { Router } from 'express'
import { validateAuthentication } from '../middleware/auth.js'
import { getUnitById, getUnitsByModule } from '../controllers/unit.js'

const router = Router()

// By id
router.get('/:unitId', validateAuthentication, getUnitById)
// Units from specific module
router.get('/modules/:moduleId/', validateAuthentication, getUnitsByModule)

export default router
