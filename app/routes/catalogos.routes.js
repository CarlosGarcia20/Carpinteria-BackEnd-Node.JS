import { Router } from "express"
import { actualizarMarca, addBrand, addFurniture, addMaterial, addUnit, añadirTipoMueble, deleteBrand, deleteFurniture, deleteMaterial, deleteUnit, eliminarTipoMueble, getFurniture, getMaterial, modificarTipoMueble, modifyFurniture, modifyMaterial, modifyUnit, obtenerMarcas, obtenerTipoMueble, obtenerUnidades } from "../controllers/catalogos.controllers.js";

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

//Catalogo de muebles
router.get('/catalogos/muebles', getFurniture);

router.post('/catalogos/muebles/add', addFurniture);

router.put('/catalogos/muebles/:furnitureId', modifyFurniture);

router.delete('/catalogos/muebles/:furnitureId', deleteFurniture);

//Catalogo de materiales
router.get('/catalogos/materiales', getMaterial);

router.post('/catalogos/materiales/add', addMaterial);

router.put('/catalogos/materiales/:idMaterial', modifyMaterial);

router.delete('/catalogos/materiales/:idMaterial', deleteMaterial);

//Catalogo de tipo de muebles
router.get('/catalogos/tipomueble', obtenerTipoMueble);

router.post('/catalogos/tipomueble/add', añadirTipoMueble);

router.put('/catalogos/tipomueble/:idTipoMueble', modificarTipoMueble);

router.delete('/catalogos/tipomueble/:idTipoMueble', eliminarTipoMueble);

export default router;