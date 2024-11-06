import { Router } from "express"
import { actualizarUsuario, eliminarUsuario, crearUsuario, obtenerUsuario, obtenerUsuarios } from "../controllers/users.controllers.js";

const router = Router();

router.get('/users/GET', obtenerUsuarios)

router.post('/users/POST', crearUsuario)

router.get('/users/GET/:userId', obtenerUsuario)

router.delete('/users/DELETE/:userId', eliminarUsuario)

router.put('/users/PUT/:userId', actualizarUsuario)

export default router;