import {Router} from 'express';
import { getMangas, getPruebas } from '../controllers/pruebas';



const router = Router();


router.get('/', getPruebas);
router.get('/:id' , getMangas)




export default router;