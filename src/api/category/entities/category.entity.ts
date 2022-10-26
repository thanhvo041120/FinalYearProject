import { Book } from "src/api/book/entities";
import { CoreEntity } from "src/api/database/inherited.entity";
import { Column, Entity, OneToMany } from "typeorm";

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

    @OneToMany(()=>Book, book=> book.category)
    book: Book[]
}