import express from 'express';
import { streamChat } from '../controllers/llmControllers.js';

const router = express.Router();

// POST /api/llm/stream
router.post('/stream', streamChat);

export default router;