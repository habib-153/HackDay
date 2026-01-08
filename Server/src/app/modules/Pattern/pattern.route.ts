import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { PatternValidation } from './pattern.validation';
import { PatternControllers } from './pattern.controller';
import auth from '../../middlewares/auth';

const router = express.Router();

// Create a new pattern (with AI analysis)
router.post(
    '/',
    auth('user', 'admin'),
    validateRequest(PatternValidation.createPatternValidationSchema),
    PatternControllers.createPattern,
);

// Analyze pattern without saving (for preview in UI)
router.post(
    '/analyze',
    auth('user', 'admin'),
    PatternControllers.analyzePattern,
);

// Get all patterns for current user
router.get('/', auth('user', 'admin'), PatternControllers.getPatterns);

// Get patterns by emotion
router.get('/emotion/:emotion', auth('user', 'admin'), PatternControllers.getPatternsByEmotion);

// Get single pattern by ID
router.get('/:id', auth('user', 'admin'), PatternControllers.getPatternById);

// Update a pattern
router.patch('/:id', auth('user', 'admin'), PatternControllers.updatePattern);

// Delete a pattern
router.delete('/:id', auth('user', 'admin'), PatternControllers.deletePattern);

// Record pattern usage (increment count)
router.post('/:id/use', auth('user', 'admin'), PatternControllers.usePattern);

// Interpret a pattern (generate meaning for recipient)
router.post(
    '/interpret',
    auth('user', 'admin'),
    PatternControllers.interpretPattern,
);

// Match a pattern against sender's library
router.post(
    '/match',
    auth('user', 'admin'),
    PatternControllers.matchPattern,
);

export const PatternRoutes = router;
