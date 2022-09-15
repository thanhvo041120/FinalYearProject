import { Databases, Repositoties } from "src/utils/constants";
import { DataSource } from "typeorm";
import { Book } from "./entities";

export const bookProviders = [
    {
        provide: Repositoties.BOOK,
        useFactory: (dataSource:DataSource)=> dataSource.getRepository(Book),
        inject: [Databases.STORE]
    }
]