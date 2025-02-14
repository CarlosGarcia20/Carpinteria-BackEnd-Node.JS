import { Router } from "express";
import { cambiarEstadoCotizacion, obtenerCotizacionesUsuarios } from "../controllers/admincotizaciones.controllers.js";

const router = Router();

router.get('/admincotizaciones', obtenerCotizacionesUsuarios)

router.post('/admincotizaciones/correo', cambiarEstadoCotizacion);

export default router;