import { Router } from "express";
import { login, logout, principal, registrarUsuario } from "../controllers/login.controllers.js";

const router = Router();

router.get('/', principal)

router.post('/login', login);

router.post('/logout', logout)

router.post('/registro', registrarUsuario)

export default router;
