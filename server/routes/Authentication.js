import express from 'express';
import { googleLogin } from '../controllers/Authentication.js';

const router = express.Router();

router.post('/google', googleLogin);

export default router;