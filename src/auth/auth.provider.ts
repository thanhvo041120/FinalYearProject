import { Databases, Repositoties } from "src/utils/constants";
import { DataSource } from "typeorm";
import { Account } from "./entities";
import { RefreshToken } from "./entities";

export const authProviders = [
    {
        provide: Repositoties.AUTH,
        useFactory: (dataSource: DataSource) => dataSource.getRepository(Account),
        inject: [Databases.STORE]
    },
    {
        provide: Repositoties.TOKEN,
        useFactory: (dataSource: DataSource) => dataSource.getRepository(RefreshToken),
        inject: [Databases.STORE]
    }
]