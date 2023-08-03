import * as dotenv from 'dotenv' 
dotenv.config()
import express,{Application} from 'express';
import cors from 'cors';
import http from 'http';

import db from '../db/connection';

import { 
    jornadaRoutes, pruebaRoutes, telegramRoutes,
    } from '../routes';



class Server{

    private app:Application;
    private port:string;
    private httpServer:http.Server;

    private apiPaths = {
        jornadas:'/api/jornadas',
        pruebas:'/api/pruebas',
        telegram:'/api/telegram'

    }


    constructor()
    {
        this.app  = express();
        this.port = process.env.PORT || '8000';
        this.httpServer=new http.Server(this.app);

        this.dbConnection();

        this.midlewares();

        //Definir mis rutas
        this.routes();

    }

    midlewares(){

        //cors
        this.app.use(cors());

        //lectura body 

        this.app.use(express.json());

        //carpeta pública

        this.app.use(express.static('public'));

    }

    routes(){

        this.app.use(this.apiPaths.jornadas,jornadaRoutes);
        this.app.use(this.apiPaths.pruebas,pruebaRoutes);
        this.app.use(this.apiPaths.telegram,telegramRoutes);

    }
    async dbConnection(){
        try{

            await db.authenticate();


            console.log('database online')

        }catch(error:any){
            throw new Error(error);
        }


    }


    listen()
    {
        this.httpServer.listen(this.port,()=>{

            console.log('Servidor corriendo en puerto ' + this.port)
        })
    }


}

export default Server;