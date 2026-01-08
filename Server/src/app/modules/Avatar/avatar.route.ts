import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { AvatarValidation } from './avatar.validation';
import { AvatarControllers } from './avatar.controller';
import auth from '../../middlewares/auth';

const router = express.Router();

// Profile
router.get('/profile', auth('user', 'admin'), AvatarControllers.getProfile);

router.patch(
    '/profile',
    auth('user', 'admin'),
    validateRequest(AvatarValidation.updateProfileValidationSchema),
    AvatarControllers.updateProfile,
);

// Suggestions
router.post(
    '/suggest',
    auth('user', 'admin'),
    validateRequest(AvatarValidation.getSuggestionsValidationSchema),
    AvatarControllers.getSuggestions,
);

// Emotion Assist
router.get('/assist', auth('user', 'admin'), AvatarControllers.getEmotionAssist);

// Relationship Insights
router.get('/insights', auth('user', 'admin'), AvatarControllers.getRelationshipInsights);

// Record Interaction Feedback
router.post(
    '/interaction',
    auth('user', 'admin'),
    validateRequest(AvatarValidation.recordInteractionValidationSchema),
    AvatarControllers.recordInteraction,
);

export const AvatarRoutes = router;
