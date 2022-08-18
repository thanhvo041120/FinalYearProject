import { DataSource } from "typeorm";
import { Book } from "./entities";

export const bookProviders = [
    {
        provide: 'BOOK_REPOSITORY',
        useFactory: (dataSource:DataSource)=> dataSource.getRepository(Book),
        inject: ['DATA_SOURCE']
    }
]