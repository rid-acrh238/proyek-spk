import express from "express";
import { getAllKriteria, createKriteria, editKriteria, removeKriteria } from "../controllers/kriteriaController.js";
import { isAuthenticated } from "../middleware/authMiddleware.js";
import { verify } from "jsonwebtoken";
import { verifyToken } from "../middleware/authMiddleware.js"

const router = express.Router();

// semua route di bawah ini butuh login admin dulu
router.use(isAuthenticated);
router.use(verifyToken);

router.get("/", getAllKriteria);
router.post("/", createKriteria);
router.put("/:id", editKriteria);
router.delete("/:id", removeKriteria);

export default router;
