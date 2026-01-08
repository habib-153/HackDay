import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { CallValidation } from './call.validation';
import { CallControllers } from './call.controller';
import auth from '../../middlewares/auth';

const router = express.Router();

router.post(
    '/initiate',
    auth('user', 'admin'),
    validateRequest(CallValidation.initiateCallValidationSchema),
    CallControllers.initiateCall,
);

router.post('/:id/join', auth('user', 'admin'), CallControllers.joinCall);

router.post('/:id/end', auth('user', 'admin'), CallControllers.endCall);

router.get('/history', auth('user', 'admin'), CallControllers.getCallHistory);

router.post(
    '/:id/emotion',
    auth('user', 'admin'),
    validateRequest(CallValidation.logEmotionValidationSchema),
    CallControllers.logEmotion,
);

router.get('/:id/emotions', auth('user', 'admin'), CallControllers.getCallEmotions);

export const CallRoutes = router;
