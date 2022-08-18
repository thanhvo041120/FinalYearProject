import { DataSource } from "typeorm";
import { Account } from "./entities";
import { RefreshToken } from "./entities";

export const authProviders = [
    {
        provide: 'AUTH_REPOSITORY',
        useFactory: (dataSource: DataSource) => dataSource.getRepository(Account),
        inject: ['DATA_SOURCE']
    },
    {
        provide: 'TOKEN_REPOSITORY',
        useFactory: (dataSource: DataSource) => dataSource.getRepository(RefreshToken),
        inject: ['DATA_SOURCE']
    }
]