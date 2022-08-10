import { CoreEntity } from "src/database/inherited.entity";
import { Column, Entity } from "typeorm";

@Entity()
export class Role extends CoreEntity {
    @Column({
        type: 'varchar',
        length: 255,
        nullable: false
    })
    name: string;

    @Column({
        type: 'varchar',
        length: 255,
        nullable: true
    })
    description: string;
}