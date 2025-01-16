import { Router } from "express";
import { guardarDatosDePago } from "../controllers/cart.controllers.js";

const router = Router();

router.post('/cart/save', guardarDatosDePago);

export default router;