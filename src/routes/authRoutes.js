import express from "express";
import { 
    registerAdmin,
    login,
    logout,
    checkSession } from "../controllers/authController.js";

const router = express.Router();

router.post("/register", registerAdmin);
router.post("/login", login);
router.post("/logout", logout);
router.get("/session", checkSession);

export default router;
