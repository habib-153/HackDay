import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { ContactValidation } from './contact.validation';
import { ContactControllers } from './contact.controller';
import auth from '../../middlewares/auth';

const router = express.Router();

router.post(
    '/',
    auth('user', 'admin'),
    validateRequest(ContactValidation.createContactValidationSchema),
    ContactControllers.createContact,
);

router.get('/', auth('user', 'admin'), ContactControllers.getContacts);

router.get('/:id', auth('user', 'admin'), ContactControllers.getContactById);

router.patch(
    '/:id',
    auth('user', 'admin'),
    validateRequest(ContactValidation.updateContactValidationSchema),
    ContactControllers.updateContact,
);

router.delete('/:id', auth('user', 'admin'), ContactControllers.deleteContact);

export const ContactRoutes = router;
