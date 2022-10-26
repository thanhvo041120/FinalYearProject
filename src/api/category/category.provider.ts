import { Databases, Repositoties } from "src/utils/constants";
import { DataSource } from "typeorm";
import { Category } from "./entities";

export const categoryProviders = [{
    provide: Repositoties.CATEGORY,
    useFactory: (dataSource: DataSource)=>dataSource.getRepository(Category),
    inject: [Databases.STORE]
}]