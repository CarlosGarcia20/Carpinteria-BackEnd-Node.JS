import { Router } from "express"
import { actualizarUsuario, eliminarUsuario, crearUsuario, obtenerUsuario, obtenerUsuarios } from "../controllers/users.controllers.js";
import validarSesion from "../middlewares/user.token.js";

const router = Router();

router.get('/obtainUsers', validarSesion, obtenerUsuarios);

router.post('/users', crearUsuario)

router.get('/users/:userId', obtenerUsuario)

router.delete('/users/:userId', eliminarUsuario)

router.put('/users/:userId', actualizarUsuario)

export default router;