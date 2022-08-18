import { CoreEntity } from "src/database/inherited.entity";
import { Column, Entity } from "typeorm";

@Entity()
export class Book extends CoreEntity{
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

    @Column({
        type: 'int',
        nullable: false
    })
    total: number;

    @Column({
        type: 'int',
        nullable: false
    })
    restInStock: number;
}