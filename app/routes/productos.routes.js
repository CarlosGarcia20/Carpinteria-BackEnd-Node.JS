import { Router } from "express"
import {  actualizarStockProducto, deshabilitarProducto, eliminarProducto, habilitarProducto, insertarProducto, obtenerProducto, obtenerProductos, restarStockAProducto } from "../controllers/productos.controllers.js";

const router = Router();

router.get('/productos', obtenerProductos)

router.get('/productos/:productId', obtenerProducto)

router.post('/productos', insertarProducto)

router.delete('/productos/:productId', eliminarProducto)

router.put('/productos/habilitar/:productId', habilitarProducto)

router.put('/productos/deshabilitar/:productId', deshabilitarProducto)

router.put('/productos/actualizar/:productId', actualizarStockProducto)

router.put('/productos/agregar/:productId/:cantidad', restarStockAProducto)

export default router;
