import { CoreEntity } from "src/database/inherited.entity";
import { Column, Entity } from "typeorm";

@Entity()
export class Category extends CoreEntity {
    @Column({
        type: 'varchar',
        length: 255,
        nullable: false,
        unique: true
    })
    name: string;
    
    @Column({
        type: 'varchar',
        length: 255,
        nullable: true
    })
    description: string;
}