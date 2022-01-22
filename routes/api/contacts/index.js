import { Router } from 'express'
import { getContacts, getContactById, addContact, removeContact, updateContact } from '../../../controllers/contacts'
import { validateCreate, validateUpdate, validateId, validateUpdateFavorite, validateQuery } from './validation'
import guard from '../../../middlewares/guard'
import wrapperError from '../../../middlewares/error-handler'

const router = new Router()

router.get('/', [guard, validateQuery], wrapperError(getContacts))

router.get('/:id', [guard, validateId], wrapperError(getContactById))

router.post('/', [guard, validateCreate], wrapperError(addContact))

router.delete('/:id', [guard, validateId], wrapperError(removeContact))

router.put('/:id', [guard, validateId], validateUpdate, wrapperError(updateContact))

router.patch('/:id/favorite', [guard, validateId], validateUpdateFavorite, wrapperError(updateContact))

export default router
