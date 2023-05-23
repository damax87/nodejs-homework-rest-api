const express = require('express');

const contactsController = require("../../controllers/contactsController");

const router = express.Router()

const {isValidId} = require("../../helpers");

const {schemas} = require("../../models/contact");

const {validateBody} = require("../../decorators");

router.get('/', contactsController.getContacts)

router.get('/:id', isValidId, contactsController.getContactById)

router.post('/', validateBody(schemas.contactAddSchema), contactsController.addContact)

router.delete('/:id', isValidId, contactsController.removeContact)

router.put('/:id', isValidId, validateBody(schemas.contactAddSchema), contactsController.updateContact)

router.patch('/:id/favorite', isValidId, validateBody(schemas.updateFavoriteSchema), contactsController.updateFavorite)

module.exports = router;
