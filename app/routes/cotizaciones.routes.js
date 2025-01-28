import { Router } from "express";
import { crearCotizacion, eliminarCotizacion, getFurniture, getMaterial, obtenerCotizacionesPorUsuario, obtenerTipoMueble } from "../controllers/cotizaciones.controllers.js";

const router = Router();

router.get('/cotizaciones/muebles', getFurniture);

router.get('/cotizaciones/materiales', getMaterial);

router.get('/cotizaciones/tipomueble/:idMueble', obtenerTipoMueble);

// Para crear, modificar, eliminar, obtener las cotizaciones
router.post('/cotizaciones/crear', crearCotizacion);

router.get('/cotizaciones/:idUser', obtenerCotizacionesPorUsuario);

router.post('/cotizaciones/eliminar/:idQuotation', eliminarCotizacion);
export default router;