import { Router } from "express";
import { obtenerCotizacionesUsuarios } from "../controllers/admincotizaciones.controllers.js";

const router = Router();

router.get('/admincotizaciones', obtenerCotizacionesUsuarios)

export default router;