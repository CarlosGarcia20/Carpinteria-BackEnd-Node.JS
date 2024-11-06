import { Router } from "express"
import {  actualizarStockProducto, deshabilitarProducto, eliminarProducto, habilitarProducto, insertarProducto, obtenerProducto, obtenerProductos, restarStockAProducto } from "../controllers/productos.controllers.js";

const router = Router();

router.get('/productos/GET', obtenerProductos)

router.get('/productos/GET/:productId', obtenerProducto)

router.post('/productos/POST', insertarProducto)

router.delete('/productos/DELETE/:productId', eliminarProducto)

router.put('/productos/habilitar/PUT/:productId', habilitarProducto)

router.put('/productos/deshabilitar/PUT/:productId', deshabilitarProducto)

router.put('/productos/actualizar/PUT/:productId', actualizarStockProducto)

router.put('/productos/agregar/PUT/:productId/:cantidad', restarStockAProducto)

export default router;
