import {Router} from 'express';
import {  getFilesClasif, getFilesOrden, postPdf } from '../controllers/telegram';



const router = Router();


router.get('/:id/:horario', postPdf);

router.get('/ordenes/:id',getFilesOrden);
router.get('/clasificaciones/:id',getFilesClasif);


export default router;