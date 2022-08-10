import { DataSource } from "typeorm";
import { Account } from "./account.entity";

export const authProviders = [
    {
        provide: 'AUTH_REPOSITORY',
        useFactory: (dataSource: DataSource) => dataSource.getRepository(Account),
        inject: ['DATA_SOURCE']
    }
]