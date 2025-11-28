import express from "express";
import { gerarResposta } from "../controllers/ChatController.js";

const router = express.Router();

// POST /chat
router.post("/", gerarResposta);

export default router;
