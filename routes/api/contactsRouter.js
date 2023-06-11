const express = require('express');

const contactsController = require("../../controllers/contactsController");

const router = express.Router()

const {isValidId, authenticate, validateBody} = require("../../middleware");

const {schemas} = require("../../models/contactAddUpdateFavorite");

router.get('/', authenticate, contactsController.getContacts)

router.get('/:id', authenticate, isValidId, contactsController.getContactById)

router.post('/', authenticate, validateBody(schemas.contactAddSchema), contactsController.addContact)

router.delete('/:id', authenticate, isValidId, contactsController.removeContact)

router.put('/:id', authenticate, isValidId, validateBody(schemas.contactAddSchema), contactsController.updateContact)

router.patch('/:id/favorite', authenticate, isValidId, validateBody(schemas.updateFavoriteSchema), contactsController.updateFavorite)



module.exports = router;
