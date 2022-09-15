import { CoreEntity } from "src/database/inherited.entity";
import { Column, Entity } from "typeorm";

@Entity()
export class Author extends CoreEntity {
    @Column({
        type: 'varchar',
        length: 255
    })
    name: string;
}
