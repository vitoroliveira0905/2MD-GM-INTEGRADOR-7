import express from "express";
import { gerarResposta } from "../controllers/chatController.js";

const router = express.Router();

// POST /chat
router.post("/", gerarResposta);

export default router;
