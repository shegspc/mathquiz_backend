import express from "express";
import { body } from "express-validator";

import {getArithmeticResults, postArithmeticResult} from "../controllers/arithmeticResult.js";
import { verifyUser } from "../utils/verifyToken.js";

const router = express.Router();

// GET /multiplicationResults/getResults
router.get('/getResult/:id', verifyUser, getArithmeticResults);

// POST/arithmeticResult/postResult
router.post(
  '/postResult',
  verifyUser,
  [
    body('score'),
    body('questionCount'),
    body('user')
  ],
  postArithmeticResult
);

export default router;