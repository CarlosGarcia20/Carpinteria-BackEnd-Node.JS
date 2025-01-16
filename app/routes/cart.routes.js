import { Router } from "express";
import { guardarDatosDePago, obtenerProductosPorUsuario } from "../controllers/cart.controllers.js";

const router = Router();

router.post('/cart/save', guardarDatosDePago);

router.get('/cart/obtain/:idUsuario/:year', obtenerProductosPorUsuario);

export default router;