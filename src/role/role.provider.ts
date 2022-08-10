import { DataSource } from "typeorm";
import { Role } from "./role.entity";

export const roleProviders = [
    {
        provide: 'ROLE_REPOSITORY',
        useFactory: async (dataSource: DataSource) => await dataSource.getRepository(Role),
        inject: ['DATA_SOURCE']
    }
]