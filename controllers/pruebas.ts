import { Request, Response } from "express";
import db from "../db/connection";

import { Association, Op, QueryTypes } from 'sequelize';



export const getPruebas = async (req:Request, res:Response)=>{

    const pruebas = await db.query<any>(
        `
        SELECT Numero, nombre FROM (
            SELECT j.Numero, j.Nombre, ROW_NUMBER() OVER (PARTITION BY j.numero ORDER BY j.id) rn FROM pruebas p
                     INNER JOIN jornadas j
                             ON p.id = j.Prueba
                     INNER JOIN super_jornadas sj
                             ON sj.Jornada=j.id)
                             sq
            WHERE sq.rn=1
                    `,
        {   
          type: QueryTypes.SELECT
        }
      );
    res.json(
        pruebas

    )
}


export const getMangas = async (req:Request, res:Response)=>{
  const {id}=req.params;


  const op= Op;

      const jornada = await db.query(`
      SELECT m.id mangaId , j.Prueba, j.ID jornadaId, m.Grado, j.Nombre, tm.Descripcion,GROUP_CONCAT( case when T.CATEGORIA ='-' then 'TSMLX' ELSE T.CATEGORIA END ORDER BY t.orden SEPARATOR '') alturas
      FROM mangas m
         INNER JOIN jornadas j
                 ON m.Jornada=j.id
         INNER JOIN super_jornadas sj
                 ON j.id = sj.Jornada
         INNER JOIN tipo_manga tm
                 ON m.Tipo=tm.ID
     INNER JOIN tandas t
                 ON t.jornada=m.jornada
              AND t.grado=M.grado
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
     WHERE sj.id=$id
     GROUP BY m.id ,j.Prueba, j.ID , m.Grado, j.Nombre, tm.Descripcion
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
