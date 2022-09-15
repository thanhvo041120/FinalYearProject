import { Databases } from "src/utils/constants";
import { DataSource } from "typeorm"

export const databaseProviders = [
    {
        provide: Databases.STORE,
        useFactory: ()=> {
            const dataSource = new DataSource({
                type: 'postgres',
                host: 'localhost',
                port: parseInt(process.env.DB_PORT),
                username: process.env.DB_USERNAME,
                password: process.env.DB_PASSWORD,
                database: process.env.DB_NAME,
                entities: [__dirname + '/../**/*.entity{.ts,.js}'],
                synchronize: true,
              });
        
              return dataSource.initialize();
        }
    }
]