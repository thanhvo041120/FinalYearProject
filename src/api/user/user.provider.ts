import { Databases, Repositoties } from "src/utils/constants";
import { DataSource } from "typeorm";
import { User } from "./entities";

export const userProviders = [
    {
        provide: Repositoties.USER,
        useFactory: (dataSource: DataSource) => dataSource.getRepository(User),
        inject: [Databases.STORE],
    }
]