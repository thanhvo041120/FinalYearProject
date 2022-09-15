import { Databases, Repositoties } from "src/utils/constants";
import { DataSource } from "typeorm";
import { Author } from "./entities";

export const authorProviders = [
    {
        provide: Repositoties.AUTHOR,
        useFactory: (dataSource: DataSource) => dataSource.getRepository(Author),
        inject: [Databases.STORE]
    }
]
