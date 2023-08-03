import * as dotenv from 'dotenv' 
// import cls from 'cls-hooked';

dotenv.config()
import {Sequelize} from "sequelize";

// const namespace = cls.createNamespace('my-very-own-namespace');

// Sequelize.useCLS(namespace);

const db = new Sequelize(
    process.env.DB_INSTANCE!,process.env.DB_UID!,process.env.DB_PASSWORD!,{
    host:process.env.DB_HOST!,
    dialect:'mariadb',
    port: parseInt(process.env.DB_PORT!)
    
});


export default db;