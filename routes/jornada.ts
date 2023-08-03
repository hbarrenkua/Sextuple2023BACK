import {Router} from 'express';
import { getJornadas, getJornada, putJornada, putManga } from '../controllers/jornadas';



const router = Router();


router.get('/', getJornadas);
router.get('/:id', getJornada);
router.put('/:id',putJornada)
router.put('/unica/:id',putManga)




export default router;