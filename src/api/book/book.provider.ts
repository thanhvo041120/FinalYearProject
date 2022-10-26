import { Databases, Repositoties } from "src/utils/constants";
import { DataSource } from "typeorm";
import { Book, BookToSA, Borrow } from "./entities";

export const bookProviders = [
    {
        provide: Repositoties.BOOK,
        useFactory: (dataSource:DataSource)=> dataSource.getRepository(Book),
        inject: [Databases.STORE]
    },
    {
        provide: Repositoties.HASHSA,
        useFactory: (dataSouce: DataSource) => dataSouce.getRepository(BookToSA),
        inject: [Databases.STORE]
    },
    {
        provide: Repositoties.BORROW,
        useFactory: (dataSouce: DataSource) => dataSouce.getRepository(Borrow),
        inject: [Databases.STORE]
    }

]