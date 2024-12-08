import { Router } from "express"
import { actualizarMarca, addBrand, addUnit, deleteBrand, deleteUnit, modifyUnit, obtenerMarcas, obtenerUnidades } from "../controllers/catalogos.controllers.js";

const router = Router();

// Catalogo de marcas
router.get('/catalogos/marcas', obtenerMarcas);

router.post('/catalogos/marcas/add', addBrand);

router.delete('/catalogos/marcas/:marcaId', deleteBrand)

router.put('/catalogos/marcas/:marcaId', actualizarMarca);


//Catalogo de unidades
router.get('/catalogos/unidades', obtenerUnidades);

router.post('/catalogos/unidades/add', addUnit);

router.put('/catalogos/unidades/:unitId', modifyUnit);

router.delete('/catalogos/unidades/:unitId', deleteUnit);

export default router;