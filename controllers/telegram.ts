import { Request, Response } from "express";
import fs from "fs";
import { Op, QueryTypes } from "sequelize";
import db from "../db/connection";

import TelegramBot from "node-telegram-bot-api";
const token = '6435835519:AAH_u_Sh7K5TV36aoXyf3CZ4ZN1dgDbKKio'; // Reemplaza con el token de tu bot
const bot = new TelegramBot(token, { polling: true });

export const getFilesOrden = async(req:Request, res:Response)=>{
  const {id}=req.params;

  console.log("what?")
  const carpeta=`C:\\SEXTUPLE\\JORNADA ${id}`
  const chatId = '-1001684568749';

  let pdfPath;
  const arrarchivos:string[]=[]
  const archivos = fs.readdirSync(carpeta)
  await bot.sendMessage(chatId,`ORDENES SALIDA JORNADA ${id}`)

  archivos.forEach(async (a)=>{
    pdfPath=a;
    if (pdfPath.startsWith('orden_de_salida'))
      await bot.sendDocument(chatId, carpeta + '\\' + pdfPath);
      

  })

  res.json({ok:"si"})

}


export const getFilesClasif = async(req:Request, res:Response)=>{

  console.log("what?")
  const carpeta='C:\\Users\\Hilario\\Downloads'

  const arrarchivos:string[]=[]
  const archivos = fs.readdirSync(carpeta)
  res.json(
    {archivos}

)
}



export const postPdf = async (req:Request, res:Response)=>{

    //https://t.me/+DwONTcHwogo3ZWY0
    const chatId = '-1001684568749';


    const {id,horario}=req.params;
    


    const op= Op;
  
        const proximos = await db.query(`
        SELECT Orden, NumeroPista, Descripcion, case Altura when 'T' then 'XS' when 'L' then 'I' when 'X' then 'L' else altura END Altura, nombrePerro, nombreGuia, Club
        FROM (
        SELECT Orden, NumeroPista, Descripcion, Altura, nombrePerro, nombreGuia, Club, Pendiente, ROW_NUMBER() OVER (PARTITION BY numeroPista ORDER BY orden) posicion
        FROM (
                 SELECT ROW_NUMBER() OVER (PARTITION BY   tipofm ORDER BY vc.tanda_orden, vc.orden_sup,orden_salida ) AS orden , 
                SUM(tiempo) OVER (PARTITION BY horario,  tipofm ORDER BY horario,  vc.tanda_orden, vc.orden_sup,orden_salida) AS duracion, 
                vc.jornada, cast(replace(s.Nombre,'Ring ','') as INT) NumeroPista, 
                vc.sesion, fusionManga IdMangaFusionada, IdManga, vc.tipo, vc.grado, vc.descripcion, concat(coalesce(vc.prefijo,''), vc.categoria) altura, vc.idperro perroId, vc.IdGuia guiaId, vc.guia nombreGuia, vc.perro nombrePerro, vc.club, 
               
           
                         vc.horario,
                         orden_salida,orden_sup ordenAltura, tiempo,duracionfm,pendiente
                         FROM (SELECT m.jornada, sj.id IdSuperJornada, j.numero, t.sesion, t.orden tanda_orden, m.ID IdManga, m.Tipo,tim.tiempo,tm.Grado, tm.Descripcion ,p.categoria,p.id IdPerro, g.id idguia, g.nombre guia, p.Nombre perro, c.Nombre club, t.horario,INSTR(m.Orden_Salida,CONCAT(',' , p.id ,',')) orden_salida,
                         case when m.tipo=6 THEN case p.categoria when 'X' THEN 5 when 'L' then 4 When 'M' then 3 when 'S' then 2 when 'T' THEN 1 ELSE 6 END
                                                                  WHEN m.tipo=11 THEN case p.categoria when 'X' THEN 5 when 'L' then 4 When 'M' then 3 when 'S' then 2 when 'T' THEN 1 ELSE 6 END
                                                                                                               WHEN m.tipo=5 THEN case p.categoria when 'X' THEN 2 when 'L' then 5 When 'M' then 4 when 'S' then 2 when 'T' THEN 1 ELSE 6 END
                                                                                                               when m.tipo=10 then case p.categoria when 'X' THEN 5 when 'L' then 3 When 'M' then 2 when 'S' then 1 when 'T' THEN 4 ELSE 6 END
                                                                                                               when m.tipo=3 then case p.categoria when 'X' THEN 5 when 'L' then 4 When 'M' then 3 when 'S' then 2 when 'T' THEN 1 ELSE 6 END
                                                                                                               when m.tipo=4 then  case p.categoria when 'X' THEN 5 when 'L' then 4 When 'M' then 3 when 'S' then 2 when 'T' THEN 1 ELSE 6 END
                                                                                                               when m.tipo=1 then case p.categoria when 'T' THEN 6 ELSE 7 END 
                                                                                                                ELSE 6 END orden_sup,fm.Id fusionManga , fm.prefijo, fm.TIPO tipofm, fm.duracion duracionfm, r.pendiente
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
         
        -- ORDER BY vc.jornada, vc.sesion, vc.tanda_orden, vc.orden_sup, orden_salida
         ) AS s
         WHERE horario = $horario and 
         pendiente = 1
         ) AS siguientes
         WHERE posicion <=5
         ORDER BY numeroPista,Orden
 
         `,
        {   
            bind:{id,horario},
            type:QueryTypes.SELECT
        }) ;
        
    
    let mensaje:string=`${formatearFechaActual()}\n` + '<b>Próximos perros</b>\n';
    let pista:number=0;
    proximos.forEach((p:any)=>{

      if (pista!==p.NumeroPista)
      {
        mensaje+=`Pista ${p.NumeroPista} (${p.Descripcion } ):\n`
        pista=p.NumeroPista;

      }
      
      mensaje+= p.Altura + ' - <b>' + p.Orden + ' - ' + p.nombrePerro + '</b>\n'




    })
  

    bot.getChat(chatId).then((chat)=>{
      console.log(chat)
      if (chat.pinned_message)
      {
        bot.deleteMessage(chatId,chat.pinned_message.message_id).then(
          (valor)=>{
            bot.sendMessage(chatId,mensaje,{parse_mode:'HTML'})
            .then((message)=>{
              const messageId = message.message_id;
               bot.pinChatMessage(chatId,messageId).then(x=>{

              const mensajeNotificacionId=messageId+1
              bot.deleteMessage(chatId,mensajeNotificacionId)
            })
                })
            
          }
        )

      }
      else{
        bot.sendMessage(chatId,mensaje,{parse_mode:'HTML'})
        .then((message)=>{
          const messageId = message.message_id;
          bot.pinChatMessage(chatId,messageId).then(x=>{

            const mensajeNotificacionId=messageId+1
            bot.deleteMessage(chatId,mensajeNotificacionId)
          })
      })

      }
    })


   
    res.json(
        {mensaje}

    )
}

const formatearFechaActual = () => {
  const fechaActual = new Date();

  // Obtener los componentes de la fecha
  const dia = String(fechaActual.getDate()).padStart(2, '0');
  const mes = String(fechaActual.getMonth() + 1).padStart(2, '0'); // Los meses se indexan desde 0, por eso se suma 1
  const anio = fechaActual.getFullYear();

  // Obtener los componentes de la hora
  const hora = String(fechaActual.getHours()).padStart(2, '0');
  const minutos = String(fechaActual.getMinutes()).padStart(2, '0');
  const segundos = String(fechaActual.getSeconds()).padStart(2, '0');

  // Combinar los componentes para formar la fecha y hora formateadas
  const fechaFormateada = `${dia}/${mes}/${anio}`;
  const horaFormateada = `${hora}:${minutos}:${segundos}`;

  // Combinar la fecha y hora formateadas en el formato deseado
  const fechaHoraFormateada = `${fechaFormateada} ${horaFormateada}`;

  return fechaHoraFormateada;
};
