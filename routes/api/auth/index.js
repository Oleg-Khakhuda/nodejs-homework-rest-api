import { Router } from 'express'
import { registration, login, logout, currentUser, updateSubscription } from '../../../controllers/auth'
import guard from '../../../middlewares/guard'
import { validateAuth, validateUpdateSubscription } from './validate'
import limiter from '../../../middlewares/rate-limit'
import wrapperError from '../../../middlewares/error-handler'

const router = new Router()

router.post('/signup', validateAuth, limiter(15 *60 * 1000, 2), wrapperError(registration))
router.post('/login', validateAuth, wrapperError(login))
router.post('/logout', guard, wrapperError(logout))
router.get('/current', guard, wrapperError(currentUser))
router.patch('/', guard, validateUpdateSubscription, wrapperError(updateSubscription))

export default router
