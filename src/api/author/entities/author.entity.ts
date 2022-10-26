import { CoreEntity } from "../../../api/database/inherited.entity";
import { Column, Entity, OneToMany } from "typeorm";
import { Book } from "src/api/book/entities";

@Entity()
export class Author extends CoreEntity {
    @Column({
        type: 'varchar',
        length: 255
    })
    name: string;

    @OneToMany(()=>Book, book => book.author)
    book: Book[]
}
