import { Request, Response } from "express";
import db from "../db/connection";

import { Association, Op, QueryTypes } from 'sequelize';


interface IOrdenSalida{
    numeroPista:number, 
    descripcion:string,
    grado:string, 
    ordenAltura:number,
    altura:string,
    turno:number, 
    turnoAlturaId:number,
    perroId:number,
    nombrePerro:string,
    guiaId:number, 
    nombreGuia:string,
    orden:number
    }

export const getJornadas = async (req:Request, res:Response)=>{


    res.json(
        {ok:"true"}

    )
}


export const getJornada = async (req:Request, res:Response)=>{
    const {id}=req.params;


    const op= Op;
  
        const jornada = await db.query<IOrdenSalida>(`

        /*SELECT ROW_NUMBER() OVER (PARTITION BY horario,  tipofm ORDER BY horario,  vc.tanda_orden, vc.orden_sup,orden_salida ) AS orden , 
        SUM(tiempo) OVER (PARTITION BY horario,  tipofm ORDER BY horario,  vc.tanda_orden, vc.orden_sup,orden_salida) AS duracion, 
        vc.jornada, cast(replace(s.Nombre,'Ring ','') as INT) NumeroPista, 
        vc.sesion, fusionManga IdMangaFusionada, IdManga, vc.tipo, vc.grado, vc.descripcion, concat(coalesce(vc.prefijo,''), vc.categoria) altura, vc.idperro perroId, vc.IdGuia guiaId, vc.guia nombreGuia, vc.perro nombrePerro, vc.club, 
       (SELECT COUNT(*) FROM (SELECT j.numero, m.jornada, t.sesion, m.ID IdManga, m.Tipo,tm.Grado, tm.Descripcion ,p.categoria ,p.id IdPerro, g.id IdGuia, g.nombre guia, p.Nombre perro, c.Nombre club, t.horario
   FROM mangas m
     INNER JOIN jornadas j
             ON m.jornada = j.id
     INNER JOIN super_jornadas sj
             ON j.ID = sj.Jornada
     INNER JOIN perros p
             ON INSTR(m.Orden_Salida,CONCAT(',' , p.id ,','))>0
     INNEr JOIN guias g
             ON p.guia = g.id
     INNER JOIN clubes c
             ON g.club = c.ID
     INNER JOIN tipo_manga tm
             ON m.Tipo=tm.ID
     INNER JOIN tandas t
             ON t.jornada=m.jornada
          AND t.categoria=case when p.grado='P.A.' THEN '-' ELSE p.Categoria END
          AND t.grado=p.grado
          AND case when t.tipo='1' then '1' 
 when t.tipo='3' then '3' 
 when t.tipo='4' then '3' 
 when t.tipo='5' then '3' 
 when t.tipo='41' then '3' 
 when t.tipo='115' then '3' 
 when t.tipo='6' then '4' 
 when t.tipo='7' then '4' 
 when t.tipo='8' then '4' 
 when t.tipo='42' then '4' 
 when t.tipo='116' then '4' 
 when t.tipo='9' then '5' 
 when t.tipo='10' then '5' 
 when t.tipo='11' then '5' 
 when t.tipo='43' then '5' 
 when t.tipo='118' then '5' 
 when t.tipo='12' then '6' 
 when t.tipo='13' then '6' 
 when t.tipo='14' then '6' 
 when t.tipo='44' then '6' 
 when t.tipo='120' then '6' 
 when t.tipo='23' then '10' 
 when t.tipo='24' then '10' 
 when t.tipo='25' then '10' 
 when t.tipo='49' then '10' 
 when t.tipo='119' then '10' 
 when t.tipo='26' then '11' 
 when t.tipo='27' then '11' 
 when t.tipo='28' then '11' 
 when t.tipo='50' then '11' 
 when t.tipo='121' then '11' 
 END =  m.tipo
 WHERE sj.id = $id
 ORDER BY t.jornada, t.sesion, t.orden,case when m.tipo=6 THEN case p.categoria when 'X' THEN 5 when 'L' then 4 When 'M' then 3 when 'S' then 2 when 'T' THEN 1 ELSE 6 END
                                            WHEN m.tipo=11 THEN case p.categoria when 'X' THEN 5 when 'L' then 4 When 'M' then 3 when 'S' then 2 when 'T' THEN 1 ELSE 6 END
                                                                                         WHEN m.tipo=5 THEN case p.categoria when 'X' THEN 2 when 'L' then 5 When 'M' then 4 when 'S' then 2 when 'T' THEN 1 ELSE 6 END
                                                                                         when m.tipo=10 then case p.categoria when 'X' THEN 5 when 'L' then 3 When 'M' then 2 when 'S' then 1 when 'T' THEN 4 ELSE 6 END
                                                                                         when m.tipo=3 then case p.categoria when 'X' THEN 5 when 'L' then 4 When 'M' then 3 when 'S' then 2 when 'T' THEN 1 ELSE 6 END
                                                                                         when m.tipo=4 then  case p.categoria when 'X' THEN 5 when 'L' then 4 When 'M' then 3 when 'S' then 2 when 'T' THEN 1 ELSE 6 END
                                                                                         when m.tipo=1 then case p.categoria when 'T' THEN 6 ELSE 7 END 
                                                                                          ELSE 6 END,
                                                                                         INSTR(m.Orden_Salida,CONCAT(',' , p.id ,','))) c WHERE c.numero = vc.numero AND c.horario=vc.horario AND c.idguia=vc.idguia AND c.descripcion<>vc.descripcion) SaltaEnOtra,
       (SELECT COUNT(*) FROM (SELECT m.jornada, t.sesion, m.ID IdManga, m.Tipo,tm.Grado, tm.Descripcion ,p.categoria,p.id IdPerro, g.id idguia, g.nombre guia, p.Nombre perro, c.Nombre club, t.horario
   FROM mangas m
     INNER JOIN perros p
             ON INSTR(m.Orden_Salida,CONCAT(',' , p.id ,','))>0
     INNEr JOIN guias g
             ON p.guia = g.id
     INNER JOIN clubes c
             ON g.club = c.ID
     INNER JOIN tipo_manga tm
             ON m.Tipo=tm.ID
     INNER JOIN tandas t
             ON t.jornada=m.jornada
          AND t.categoria=case when p.grado='P.A.' THEN '-' ELSE p.Categoria END
          AND t.grado=p.grado
          AND case when t.tipo='1' then '1' 
 when t.tipo='3' then '3' 
 when t.tipo='4' then '3' 
 when t.tipo='5' then '3' 
 when t.tipo='41' then '3' 
 when t.tipo='115' then '3' 
 when t.tipo='6' then '4' 
 when t.tipo='7' then '4' 
 when t.tipo='8' then '4' 
 when t.tipo='42' then '4' 
 when t.tipo='116' then '4' 
 when t.tipo='9' then '5' 
 when t.tipo='10' then '5' 
 when t.tipo='11' then '5' 
 when t.tipo='43' then '5' 
 when t.tipo='118' then '5' 
 when t.tipo='12' then '6' 
 when t.tipo='13' then '6' 
 when t.tipo='14' then '6' 
 when t.tipo='44' then '6' 
 when t.tipo='120' then '6' 
 when t.tipo='23' then '10' 
 when t.tipo='24' then '10' 
 when t.tipo='25' then '10' 
 when t.tipo='49' then '10' 
 when t.tipo='119' then '10' 
 when t.tipo='26' then '11' 
 when t.tipo='27' then '11' 
 when t.tipo='28' then '11' 
 when t.tipo='50' then '11' 
 when t.tipo='121' then '11' 
 END =  m.tipo
 ORDER BY t.jornada, t.sesion, t.orden,case when m.tipo=6 THEN case p.categoria when 'X' THEN 5 when 'L' then 4 When 'M' then 3 when 'S' then 2 when 'T' THEN 1 ELSE 6 END
                                            WHEN m.tipo=11 THEN case p.categoria when 'X' THEN 5 when 'L' then 4 When 'M' then 3 when 'S' then 2 when 'T' THEN 1 ELSE 6 END
                                                                                         WHEN m.tipo=5 THEN case p.categoria when 'X' THEN 2 when 'L' then 5 When 'M' then 4 when 'S' then 2 when 'T' THEN 1 ELSE 6 END
                                                                                         when m.tipo=10 then case p.categoria when 'X' THEN 5 when 'L' then 3 When 'M' then 2 when 'S' then 1 when 'T' THEN 4 ELSE 6 END
                                                                                         when m.tipo=3 then case p.categoria when 'X' THEN 5 when 'L' then 4 When 'M' then 3 when 'S' then 2 when 'T' THEN 1 ELSE 6 END
                                                                                         when m.tipo=4 then  case p.categoria when 'X' THEN 5 when 'L' then 4 When 'M' then 3 when 'S' then 2 when 'T' THEN 1 ELSE 6 END
                                                                                         when m.tipo=1 then case p.categoria when 'T' THEN 6 ELSE 7 END 
                                                                                          ELSE 6 END,
                                                                                         INSTR(m.Orden_Salida,CONCAT(',' , p.id ,','))) c WHERE c.jornada = vc.jornada AND c.horario=vc.horario AND c.idguia=vc.idguia AND c.idperro<>vc.idperro and c.descripcion=vc.descripcion) RepiteEnEsta ,
 --      (SELECT COUNT(*) FROM helpers h WHERE h.jornada= vc.jornada AND h.horario=vc.horario AND h.guia=vc.IDguia) helper,
                 vc.horario,
                 orden_salida,orden_sup ordenAltura, tiempo,duracionfm
                 FROM (SELECT m.jornada, sj.id IdSuperJornada, j.numero, t.sesion, t.orden tanda_orden, m.ID IdManga, m.Tipo,tim.tiempo,tm.Grado, tm.Descripcion ,p.categoria,p.id IdPerro, g.id idguia, g.nombre guia, p.Nombre perro, c.Nombre club, t.horario,INSTR(m.Orden_Salida,CONCAT(',' , p.id ,',')) orden_salida,
                 case when m.tipo=6 THEN case p.categoria when 'X' THEN 5 when 'L' then 4 When 'M' then 3 when 'S' then 2 when 'T' THEN 1 ELSE 6 END
                                                          WHEN m.tipo=11 THEN case p.categoria when 'X' THEN 5 when 'L' then 4 When 'M' then 3 when 'S' then 2 when 'T' THEN 1 ELSE 6 END
                                                                                                       WHEN m.tipo=5 THEN case p.categoria when 'X' THEN 2 when 'L' then 5 When 'M' then 4 when 'S' then 2 when 'T' THEN 1 ELSE 6 END
                                                                                                       when m.tipo=10 then case p.categoria when 'X' THEN 5 when 'L' then 3 When 'M' then 2 when 'S' then 1 when 'T' THEN 4 ELSE 6 END
                                                                                                       when m.tipo=3 then case p.categoria when 'X' THEN 5 when 'L' then 4 When 'M' then 3 when 'S' then 2 when 'T' THEN 1 ELSE 6 END
                                                                                                       when m.tipo=4 then  case p.categoria when 'X' THEN 5 when 'L' then 4 When 'M' then 3 when 'S' then 2 when 'T' THEN 1 ELSE 6 END
                                                                                                       when m.tipo=1 then case p.categoria when 'T' THEN 6 ELSE 7 END 
                                                                                                        ELSE 6 END orden_sup,fm.Id fusionManga , fm.prefijo, fm.TIPO tipofm, fm.duracion duracionfm
FROM mangas m
     INNER JOIN jornadas j
             ON m.Jornada=j.id
     INNER JOIN super_jornadas sj
             ON j.id = sj.Jornada
     INNER JOIN fusion_mangas fm
             ON m.id = fm.manga
     INNER JOIN perros p
             ON INSTR(m.Orden_Salida,CONCAT(',' , p.id ,','))>0
     INNEr JOIN guias g
             ON p.guia = g.id
     INNER JOIN clubes c
             ON g.club = c.ID
     INNER JOIN tipo_manga tm
             ON m.Tipo=tm.ID
     INNER JOIN tiempos_manga tim
             ON tm.id = tim.tipo_manga
     INNER JOIN tandas t
             ON t.jornada=m.jornada
          AND t.categoria=case when p.grado='P.A.' THEN '-' ELSE p.Categoria END
          AND t.grado=p.grado
          AND case when t.tipo='1' then '1' 
 when t.tipo='3' then '3' 
 when t.tipo='4' then '3' 
 when t.tipo='5' then '3' 
 when t.tipo='41' then '3' 
 when t.tipo='115' then '3' 
 when t.tipo='6' then '4' 
 when t.tipo='7' then '4' 
 when t.tipo='8' then '4' 
 when t.tipo='42' then '4' 
 when t.tipo='116' then '4' 
 when t.tipo='9' then '5' 
 when t.tipo='10' then '5' 
 when t.tipo='11' then '5' 
 when t.tipo='43' then '5' 
 when t.tipo='118' then '5' 
 when t.tipo='12' then '6' 
 when t.tipo='13' then '6' 
 when t.tipo='14' then '6' 
 when t.tipo='44' then '6' 
 when t.tipo='120' then '6' 
 when t.tipo='23' then '10' 
 when t.tipo='24' then '10' 
 when t.tipo='25' then '10' 
 when t.tipo='49' then '10' 
 when t.tipo='119' then '10' 
 when t.tipo='26' then '11' 
 when t.tipo='27' then '11' 
 when t.tipo='28' then '11' 
 when t.tipo='50' then '11' 
 when t.tipo='121' then '11' 
 END =  m.tipo
 ORDER BY t.jornada, t.sesion, t.orden,case when m.tipo=6 THEN case p.categoria when 'X' THEN 5 when 'L' then 4 When 'M' then 3 when 'S' then 2 when 'T' THEN 1 ELSE 6 END
                                            WHEN m.tipo=11 THEN case p.categoria when 'X' THEN 5 when 'L' then 4 When 'M' then 3 when 'S' then 2 when 'T' THEN 1 ELSE 6 END
                                                                                         WHEN m.tipo=5 THEN case p.categoria when 'X' THEN 2 when 'L' then 5 When 'M' then 4 when 'S' then 2 when 'T' THEN 1 ELSE 6 END
                                                                                         when m.tipo=10 then case p.categoria when 'X' THEN 5 when 'L' then 3 When 'M' then 2 when 'S' then 1 when 'T' THEN 4 ELSE 6 END
                                                                                         when m.tipo=3 then case p.categoria when 'X' THEN 5 when 'L' then 4 When 'M' then 3 when 'S' then 2 when 'T' THEN 1 ELSE 6 END
                                                                                         when m.tipo=4 then  case p.categoria when 'X' THEN 5 when 'L' then 4 When 'M' then 3 when 'S' then 2 when 'T' THEN 1 ELSE 6 END
                                                                                         when m.tipo=1 then case p.categoria when 'T' THEN 6 ELSE 7 END 
                                                                                          ELSE 6 END,
                                                                                         INSTR(m.Orden_Salida,CONCAT(',' , p.id ,','))) vc
                                                                                         INNER JOIN sesiones s
                                                                                               ON vc.sesion = s.id
 WHERE vc.IdSuperJornada =$id
 ORDER BY vc.jornada, vc.sesion, vc.tanda_orden, vc.orden_sup, orden_salida*/

 SELECT ROW_NUMBER() OVER (PARTITION BY   tipofm ORDER BY vc.tanda_orden, vc.orden_sup,orden_salida ) AS orden , 
 SUM(tiempo+ case when vc.x >1 then tiempoCA ELSE 0 end) ovER (PARTITION BY horario,  tipofm , cast(replace(s.Nombre,'Ring ','') as INT)  ORDER BY horario,  vc.tanda_orden, vc.orden_sup,orden_salida) AS duracion, 
 vc.jornada, cast(replace(s.Nombre,'Ring ','') as INT) NumeroPista, 
 vc.sesion, fusionManga IdMangaFusionada, IdManga, vc.tipo, vc.grado, vc.descripcion, concat(coalesce(vc.prefijo,''), vc.categoria) altura, vc.idperro perroId, vc.IdGuia guiaId, vc.guia nombreGuia, vc.perro nombrePerro, vc.club, 


          vc.horario,
          orden_salida,orden_sup ordenAltura, tiempo,duracionfm, (
SELECT concat('Pista ', ch.Pista, GROUP_CONCAT( CONCAT(' Horario ', ch.Horario,' turno ' , ch.TurnoHelper,  ' desde ' , ordenDesde, ' hasta ', ordenhasta) ORDER BY horario)  ) trabajo
  FROM config_helpers ch
INNER JOIN helpers_jornada hj
 ON ch.Jornada=hj.jornada
AND ch.TurnoHelper=hj.turnohelper
AND ch.Pista=hj.pista
WHERE ch.Jornada=$id
  AND ch.horario=vc.horario
 AND hj.guia=vc.IdGuia
 GROUP BY ch.Pista
			 ) AS ayuda, pendiente
          FROM (SELECT m.jornada, sj.id IdSuperJornada, j.numero, t.sesion, t.orden tanda_orden, m.ID IdManga, m.Tipo,tim.tiempo tiempo,
          ROW_NUMBER() OVER (PARTITION BY m.jornada, t.horario,m.tipo,cast(replace(s.Nombre,'Ring ','') as INT)  ORDER BY t.jornada, t.sesion, t.orden,case when m.tipo=6 THEN case p.categoria when 'X' THEN 5 when 'L' then 4 When 'M' then 3 when 'S' then 2 when 'T' THEN 1 ELSE 6 END
                                     WHEN m.tipo=11 THEN case p.categoria when 'X' THEN 5 when 'L' then 4 When 'M' then 3 when 'S' then 2 when 'T' THEN 1 ELSE 6 END
                                                                                  WHEN m.tipo=5 THEN case p.categoria when 'X' THEN 2 when 'L' then 5 When 'M' then 4 when 'S' then 2 when 'T' THEN 1 ELSE 6 END
                                                                                  when m.tipo=10 then case p.categoria when 'X' THEN 5 when 'L' then 3 When 'M' then 2 when 'S' then 1 when 'T' THEN 4 ELSE 6 END
                                                                                  when m.tipo=3 then case p.categoria when 'X' THEN 5 when 'L' then 4 When 'M' then 3 when 'S' then 2 when 'T' THEN 1 ELSE 6 END
                                                                                  when m.tipo=4 then  case p.categoria when 'X' THEN 5 when 'L' then 4 When 'M' then 3 when 'S' then 2 when 'T' THEN 1 ELSE 6 END
                                                                                  when m.tipo=1 then case p.categoria when 'T' THEN 6 ELSE 7 END 
                                                                                   ELSE 6 END,
                                                                                  INSTR(m.Orden_Salida,CONCAT(',' , p.id ,','))) x,
			 case when ROW_NUMBER() OVER (PARTITION BY m.id,p.categoria ORDER BY t.jornada, t.sesion, t.orden,case when m.tipo=6 THEN case p.categoria when 'X' THEN 5 when 'L' then 4 When 'M' then 3 when 'S' then 2 when 'T' THEN 1 ELSE 6 END
                                     WHEN m.tipo=11 THEN case p.categoria when 'X' THEN 5 when 'L' then 4 When 'M' then 3 when 'S' then 2 when 'T' THEN 1 ELSE 6 END
                                                                                  WHEN m.tipo=5 THEN case p.categoria when 'X' THEN 2 when 'L' then 5 When 'M' then 4 when 'S' then 2 when 'T' THEN 1 ELSE 6 END
                                                                                  when m.tipo=10 then case p.categoria when 'X' THEN 5 when 'L' then 3 When 'M' then 2 when 'S' then 1 when 'T' THEN 4 ELSE 6 END
                                                                                  when m.tipo=3 then case p.categoria when 'X' THEN 5 when 'L' then 4 When 'M' then 3 when 'S' then 2 when 'T' THEN 1 ELSE 6 END
                                                                                  when m.tipo=4 then  case p.categoria when 'X' THEN 5 when 'L' then 4 When 'M' then 3 when 'S' then 2 when 'T' THEN 1 ELSE 6 END
                                                                                  when m.tipo=1 then case p.categoria when 'T' THEN 6 ELSE 7 END 
                                                                                   ELSE 6 END,
                                                                                  INSTR(m.Orden_Salida,CONCAT(',' , p.id ,','))) =1 then 300 ELSE 0 end tiempoCA,
			 tm.Grado, tm.Descripcion ,p.categoria,p.id IdPerro, g.id idguia, g.nombre guia, p.Nombre perro, c.Nombre club, t.horario,INSTR(m.Orden_Salida,CONCAT(',' , p.id ,',')) orden_salida,
          case when m.tipo=6 THEN case p.categoria when 'X' THEN 5 when 'L' then 4 When 'M' then 3 when 'S' then 2 when 'T' THEN 1 ELSE 6 END
                                                   WHEN m.tipo=11 THEN case p.categoria when 'X' THEN 5 when 'L' then 4 When 'M' then 3 when 'S' then 2 when 'T' THEN 1 ELSE 6 END
                                                                                                WHEN m.tipo=5 THEN case p.categoria when 'X' THEN 2 when 'L' then 5 When 'M' then 4 when 'S' then 2 when 'T' THEN 1 ELSE 6 END
                                                                                                when m.tipo=10 then case p.categoria when 'X' THEN 5 when 'L' then 3 When 'M' then 2 when 'S' then 1 when 'T' THEN 4 ELSE 6 END
                                                                                                when m.tipo=3 then case p.categoria when 'X' THEN 5 when 'L' then 4 When 'M' then 3 when 'S' then 2 when 'T' THEN 1 ELSE 6 END
                                                                                                when m.tipo=4 then  case p.categoria when 'X' THEN 5 when 'L' then 4 When 'M' then 3 when 'S' then 2 when 'T' THEN 1 ELSE 6 END
                                                                                                when m.tipo=1 then case p.categoria when 'T' THEN 6 ELSE 7 END 
                                                                                                 ELSE 6 END orden_sup,fm.Id fusionManga , fm.prefijo, fm.TIPO tipofm, fm.duracion duracionfm, r.Pendiente
FROM mangas m
INNER JOIN jornadas j
      ON m.Jornada=j.id
INNER JOIN super_jornadas sj
      ON j.id = sj.Jornada
INNER JOIN fusion_mangas fm
      ON m.id = fm.manga
INNER JOIN perros p
      ON INSTR(m.Orden_Salida,CONCAT(',' , p.id ,','))>0
INNEr JOIN guias g
      ON p.guia = g.id
INNER JOIN clubes c
      ON g.club = c.ID
INNER JOIN tipo_manga tm
      ON m.Tipo=tm.ID
INNER JOIN tiempos_manga tim
      ON tm.id = tim.tipo_manga
INNER JOIN resultados r
       ON r.Prueba=j.Prueba
     AND r.Manga=m.id
     AND r.Perro=p.id
INNER JOIN tandas t
      ON t.jornada=m.jornada
   AND t.categoria=case when p.grado='P.A.' THEN '-' ELSE p.Categoria END
   AND case when tm.ID IN (7,12) then p.grado else T.grado END =p.grado
   AND case when t.tipo='1' then '1' 
when t.tipo='3' then '3' 
when t.tipo='4' then '3' 
when t.tipo='5' then '3' 
when t.tipo='41' then '3' 
when t.tipo='115' then '3' 
when t.tipo='6' then '4' 
when t.tipo='7' then '4' 
when t.tipo='8' then '4' 
when t.tipo='42' then '4' 
when t.tipo='116' then '4' 
when t.tipo='9' then '5' 
when t.tipo='10' then '5' 
when t.tipo='11' then '5' 
when t.tipo='43' then '5' 
when t.tipo='118' then '5' 
when t.tipo='12' then '6' 
when t.tipo='13' then '6' 
when t.tipo='14' then '6' 
when t.tipo='44' then '6' 
when t.tipo='120' then '6' 
when t.tipo='23' then '10' 
when t.tipo='24' then '10' 
when t.tipo='25' then '10' 
when t.tipo='49' then '10' 
when t.tipo='119' then '10' 
when t.tipo='26' then '11' 
when t.tipo='27' then '11' 
when t.tipo='28' then '11' 
when t.tipo='50' then '11' 
when t.tipo='121' then '11' 
when t.tipo = '122' then '7'
when t.tipo = '15' then '7'
when t.tipo = '16' then '7'
when t.tipo = '17' then '7'
when t.tipo = '45' then '7'
when t.tipo = '123' then '12'
when t.tipo = '29' then '12'
when t.tipo = '30' then '12'
when t.tipo = '31' then '12'
when t.tipo = '51' then '12'
END =  m.tipo
INNER JOIN sesiones s
ON t.sesion = s.id
ORDER BY t.jornada, t.sesion, t.orden,case when m.tipo=6 THEN case p.categoria when 'X' THEN 5 when 'L' then 4 When 'M' then 3 when 'S' then 2 when 'T' THEN 1 ELSE 6 END
                                     WHEN m.tipo=11 THEN case p.categoria when 'X' THEN 5 when 'L' then 4 When 'M' then 3 when 'S' then 2 when 'T' THEN 1 ELSE 6 END
                                                                                  WHEN m.tipo=5 THEN case p.categoria when 'X' THEN 2 when 'L' then 5 When 'M' then 4 when 'S' then 2 when 'T' THEN 1 ELSE 6 END
                                                                                  when m.tipo=10 then case p.categoria when 'X' THEN 5 when 'L' then 3 When 'M' then 2 when 'S' then 1 when 'T' THEN 4 ELSE 6 END
                                                                                  when m.tipo=3 then case p.categoria when 'X' THEN 5 when 'L' then 4 When 'M' then 3 when 'S' then 2 when 'T' THEN 1 ELSE 6 END
                                                                                  when m.tipo=4 then  case p.categoria when 'X' THEN 5 when 'L' then 4 When 'M' then 3 when 'S' then 2 when 'T' THEN 1 ELSE 6 END
                                                                                  when m.tipo=1 then case p.categoria when 'T' THEN 6 ELSE 7 END 
                                                                                   ELSE 6 END,
                                                                                  INSTR(m.Orden_Salida,CONCAT(',' , p.id ,','))) vc
                                                                                  INNER JOIN sesiones s
                                                                                        ON vc.sesion = s.id
WHERE vc.IdSuperJornada =$id
ORDER BY vc.jornada, vc.sesion, vc.tanda_orden, vc.orden_sup, orden_salida;





 `,
        {   
            bind:{id},
            type:QueryTypes.SELECT
        }) ;
        


        if (!jornada){
            return res.status(404).json({msg:`No existe un jornada con código ${id}`});
        }
        res.json(jornada);


}


interface PerroManga {
    perroId: number;
    mangaId: number;
    orden: number;
  }

export const putJornada= async (req:Request, res:Response)=>{
    const {id}=req.params;
    const {body} = req;

console.log(id)
    const ordenCerrado = await db.query<any>(`select OrdenCerrado from super_jornadas where id = $id LIMIT 1`,
    {bind:{id},
        type:QueryTypes.SELECT})

    const mangaIdGrupos: { [mangaId: number]: number[] } = {};

    console.log(ordenCerrado)

    if (ordenCerrado[0].OrdenCerrado==1)
            {
                res.json({estadoManga:"cerrada"});
                return
            }



    // Recorremos el array original y agrupamos los perros por mangaId

    for (const item of body) {
        const mangaId = item.mangaId;
        if (!mangaIdGrupos[mangaId]) {
          mangaIdGrupos[mangaId] = [];
        }
        mangaIdGrupos[mangaId].push(item.perroId);
      
        await db.query(`UPDATE mangas SET orden_salida = REPLACE(orden_salida, $perro, ',') WHERE id = $manga`,
          {   
            bind: { perro: `,${item.perroId},`, manga: mangaId },
            type: QueryTypes.UPDATE
          }

        );

}

  for (const item of Object.entries(mangaIdGrupos))
  {

     


  }

    
    const resultado: Promise<{ mangaId: number; perros: string;equivalenteMangaId:number,dbJornada:string }[]> = Promise.all(
        Object.entries(mangaIdGrupos).map(async ([mangaId, perros]) => {
                const equiv= await db.query<any>(` SELECT  replace(replace(GROUP_CONCAT(id SEPARATOR ',') ,cast($manga AS VARCHAR(20)),''),',','') EquivalenteMangaId
                FROM mangas WHERE id IN (SELECT d.id from mangas  d
                             inner join mangas o
                                     ON o.grado = d.grado
                                            AND d.Jornada=o.jornada
                             WHERE o.id=$manga
                            )
             GROUP BY grado
             `,
             {   
               bind: {manga: mangaId },
               type: QueryTypes.SELECT
             });
        console.log(mangaId,equiv)


                const jornada = await db.query<any>(
            `select orden_salida from mangas WHERE id = $id`,
            {   
              bind: { id: mangaId },
              type: QueryTypes.SELECT
            }
          );
          return {
            mangaId: parseInt(mangaId),
            equivalenteMangaId: equiv[0].EquivalenteMangaId,
            perros: perros.join(','),
            dbJornada: jornada[0].orden_salida
          };
        })
      );



      resultado.then(async (data) =>{

        for (const manga of data) {
                let nuevoOrden=  manga.dbJornada.replace(new RegExp("BEGIN,","g"),"").replace(new RegExp(",END","g"),"").replace(new RegExp("END","g"),"")

                const ordenMangaEquiv= data.find(e=>(e.mangaId==manga.equivalenteMangaId))


                if (ordenMangaEquiv)
                        nuevoOrden = "BEGIN," + manga.perros + "," + ordenMangaEquiv.perros + ",END"
                else
                        nuevoOrden = "BEGIN," + manga.perros + ",END"

                        console.log(manga, nuevoOrden)
                        await db.query(`
                                  UPDATE mangas 
                                  SET orden_salida = $orden 
                                  WHERE id IN (
                                    SELECT d.id 
                                    FROM mangas d
                                    INNER JOIN mangas o
                                    ON o.grado = d.grado AND d.Jornada = o.jornada 
                                    WHERE o.id = $manga)
                                `,
              {   
                bind: { orden: nuevoOrden, manga: manga.mangaId },
                type: QueryTypes.UPDATE
              }
                );
        }
        // data.map(async (manga)=>{
        //     console.log(manga);
        //     let nuevoOrden=manga.dbJornada.replace(new RegExp("BEGIN,","g"),"").replace(new RegExp(",END","g"),"").replace(new RegExp("END","g"),"")
        //     nuevoOrden = "BEGIN," + manga.perros + "," + nuevoOrden + ",END"
        //     await db.query(`UPDATE mangas SET orden_salida = $orden WHERE id = $manga`,
        //   {   
        //     bind: { orden: nuevoOrden, manga: manga.mangaId },
        //     type: QueryTypes.UPDATE
        //   }
        // );
        // })

      });

      res.json({msg:'ok'});
}



// resultado.then(async (data) =>{

//         for (const manga of data) {
//                 let nuevoOrden = manga.dbJornada.replace(new RegExp("BEGIN,", "g"), "").replace(new RegExp(",END", "g"), "").replace(new RegExp("END", "g"), "");
//                 nuevoOrden = "BEGIN," + manga.perros + "," + nuevoOrden + ",END";
            
//                 await db.query(`
//                   UPDATE mangas 
//                   SET orden_salida = $orden 
//                   WHERE id IN (
//                     SELECT d.id 
//                     FROM mangas d
//                     INNER JOIN mangas o
//                     ON o.grado = d.grado AND d.Jornada = o.jornada 
//                     WHERE o.id = $manga
//                   )`,
//                   {   
//                     bind: { orden: nuevoOrden, manga: manga.mangaId },
//                     type: QueryTypes.UPDATE
//                   }
//                 );
//               }
      
//         // data.map(async (manga:any)=>{
//         //     let nuevoOrden=manga.dbJornada.replace(new RegExp("BEGIN,","g"),"").replace(new RegExp(",END","g"),"").replace(new RegExp("END","g"),"")
//         //     nuevoOrden = "BEGIN," + manga.perros + "," + nuevoOrden + ",END"
//         //     await db.query(`UPDATE mangas SET orden_salida = $orden WHERE id in (SELECT d.id from mangas  d
//         //         inner join mangas o
//         //                 ON o.grado = d.grado
//         //                        AND d.Jornada=o.jornada 
//         //         WHERE o.id=$manga
//         //        ) `,
//         //   {   
//         //     bind: { orden: nuevoOrden, manga: manga.mangaId },
//         //     type: QueryTypes.UPDATE
//         //   }
//         // );
//         // })

//       });



export const putManga= async (req:Request, res:Response)=>{
        const {id}=req.params;
        const {body} = req;
    
        
        const ordenCerrado = await db.query<any>(`select OrdenCerrado from super_jornadas where id = $id LIMIT 1`,
        {bind:{id},
            type:QueryTypes.SELECT})

console.log(ordenCerrado)
if (ordenCerrado[0].OrdenCerrado==1)
{
res.json({estadoManga:"cerrada"});
return;
}
                const mangaIdGrupos: { [mangaId: number]: number[] } = {};
    
    
        // Recorremos el array original y agrupamos los perros por mangaId
    
        for (const item of body) {
            const mangaId = item.mangaId;
            if (!mangaIdGrupos[mangaId]) {
              mangaIdGrupos[mangaId] = [];
            }
            mangaIdGrupos[mangaId].push(item.perroId);
          
            await db.query(`UPDATE mangas SET orden_salida = REPLACE(orden_salida, $perro, ',') WHERE id = $manga`,
              {   
                bind: { perro: `,${item.perroId},`, manga: mangaId },
                type: QueryTypes.UPDATE
              }
    
            );
    
    }
    
      
        
        const resultado: Promise<{ mangaId: number; perros: string;equivalenteMangaId:number,dbJornada:string }[]> = Promise.all(
            Object.entries(mangaIdGrupos).map(async ([mangaId, perros]) => {
                    const equiv= await db.query<any>(` SELECT  replace(replace(GROUP_CONCAT(id SEPARATOR ',') ,cast($manga AS VARCHAR(20)),''),',','') EquivalenteMangaId
                    FROM mangas WHERE id IN (SELECT d.id from mangas  d
                                 inner join mangas o
                                         ON o.grado = d.grado
                                                AND d.Jornada=o.jornada
                                 WHERE o.id=$manga
                                )
                 GROUP BY grado
                 `,
                 {   
                   bind: {manga: mangaId },
                   type: QueryTypes.SELECT
                 });
            console.log(mangaId,equiv)
    
    
                    const jornada = await db.query<any>(
                `select orden_salida from mangas WHERE id = $id`,
                {   
                  bind: { id: mangaId },
                  type: QueryTypes.SELECT
                }
              );
              return {
                mangaId: parseInt(mangaId),
                equivalenteMangaId: equiv[0].EquivalenteMangaId,
                perros: perros.join(','),
                dbJornada: jornada[0].orden_salida
              };
            })
          );
    
    
    
          resultado.then(async (data) =>{
    
            
            data.map(async (manga)=>{
                console.log(manga);
                let nuevoOrden=manga.dbJornada.replace(new RegExp("BEGIN,","g"),"").replace(new RegExp(",END","g"),"").replace(new RegExp("END","g"),"")
                nuevoOrden = "BEGIN," + manga.perros + "," + nuevoOrden + ",END"
                await db.query(`UPDATE mangas SET orden_salida = $orden WHERE id = $manga`,
              {   
                bind: { orden: nuevoOrden, manga: manga.mangaId },
                type: QueryTypes.UPDATE
              }
            );
            })
    
          });
    
          res.json({msg:'ok'});
    }
    
    
    