import expressRouter from 'express'
import { getAdminData } from '../controllers/admin.controller.js'

const router = expressRouter()

router.get('/', getAdminData)

export default router