import { Router } from "express";
import multer from "multer";
import path from 'path';
import { crearCotizacion, eliminarCotizacion, getFurniture, getMaterial, obtenerCotizacionesAceptadasPorUsuario, obtenerCotizacionesPorUsuario, obtenerTipoMueble } from "../controllers/cotizaciones.controllers.js";

// Configurar multer para la ruta de imagen
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'app/uploads/cotizaciones');
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      cb(null, uniqueSuffix + path.extname(file.originalname));
    },
});
  
const upload = multer({ storage });

const router = Router();

router.get('/cotizaciones/muebles', getFurniture);

router.get('/cotizaciones/materiales', getMaterial);

router.get('/cotizaciones/tipomueble/:idMueble', obtenerTipoMueble);

// Para crear, modificar, eliminar, obtener las cotizaciones
router.post('/cotizaciones/crear', upload.single('imagen'), crearCotizacion);

router.get('/cotizaciones/:idUser', obtenerCotizacionesPorUsuario);

router.get('/cotizaciones/aceptadas/:idUser', obtenerCotizacionesAceptadasPorUsuario);

router.delete('/cotizaciones/:idQuotation', eliminarCotizacion);
export default router;