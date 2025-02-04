import { Router } from "express"
import multer from 'multer';
import path from 'path';
import { eliminarProducto, guardarEditarProducto, insertarProducto, obtenerProducto, obtenerProductos, verificarStock } from "../controllers/productos.controllers.js";

// Configurar multer para la ruta de imagen
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'app/uploads');
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      cb(null, uniqueSuffix + path.extname(file.originalname));
    },
});
  
const upload = multer({ storage });

const router = Router();

router.get('/obtainProducts', obtenerProductos)

router.get('/productos/:productId', obtenerProducto)

router.post('/insertProducts', upload.single('imagen'), insertarProducto)

router.delete('/deletProduct/:productId', eliminarProducto)

router.put('/productos/update/:productId', upload.single('imagen'), guardarEditarProducto)

router.post('/productos/stock/:productId', verificarStock);

export default router;
