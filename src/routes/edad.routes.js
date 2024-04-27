import { Router } from 'express';
import { crearPrograma, verProgramas } from '../controllers/edades.controllers.js';
import { verificarToken, verificarAdministrador } from '../middlewares/validateToken.js';

const router = Router();

router.post("/crearPrograma", verificarToken, verificarAdministrador,  crearPrograma);
router.get("/programas", verProgramas);

export default router;