import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { PatternValidation } from './pattern.validation';
import { PatternControllers } from './pattern.controller';
import auth from '../../middlewares/auth';

const router = express.Router();

router.post(
    '/',
    auth('user', 'admin'),
    validateRequest(PatternValidation.createPatternValidationSchema),
    PatternControllers.createPattern,
);

router.get('/', auth('user', 'admin'), PatternControllers.getPatterns);

router.get('/:id', auth('user', 'admin'), PatternControllers.getPatternById);

router.get('/emotion/:emotion', auth('user', 'admin'), PatternControllers.getPatternsByEmotion);

router.delete('/:id', auth('user', 'admin'), PatternControllers.deletePattern);

router.post(
    '/interpret',
    auth('user', 'admin'),
    validateRequest(PatternValidation.interpretPatternValidationSchema),
    PatternControllers.interpretPattern,
);

export const PatternRoutes = router;
