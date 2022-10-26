import { Databases, Repositoties } from "src/utils/constants";
import { DataSource } from "typeorm";
import { Role } from "./role.entity";

export const roleProviders = [
    {
        provide: Repositoties.ROLE,
        useFactory: async (dataSource: DataSource) => await dataSource.getRepository(Role),
        inject: [Databases.STORE]
    }
]