const express = require('express');

const contactsController = require("../../controllers/contactsController");

const router = express.Router()

const schemas = require("../../schemas/contactsSchema");

const {validateBody} = require("../../decorators");

router.get('/', contactsController.getContacts)

router.get('/:id', contactsController.getContactById)

router.post('/', validateBody(schemas.contactAddSchema), contactsController.addContact)

router.delete('/:id', contactsController.removeContact)

router.put('/:id', validateBody(schemas.contactAddSchema), contactsController.updateContact)

module.exports = router
