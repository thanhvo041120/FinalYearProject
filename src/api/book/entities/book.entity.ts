import { Author } from "src/api/author/entities";
import { Category } from "src/api/category/entities";
import { CoreEntity } from "src/api/database/inherited.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, OneToOne } from "typeorm";
import { BookToSA } from "./bookToSA.entity";

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
        nullable: true
    })
    description: string;

    @Column({
        type: 'int',
        nullable: false
    })
    total: number;

    @Column({
        type: 'varchar',
        nullable: false
    })
    image: string;

    @Column({
        type: 'int',
    })
    categoryId: number
    @ManyToOne(()=>Category, category => category.book, {onDelete: 'SET NULL'})
    @JoinColumn({name: 'categoryId'})
    category: Category;

    @Column({
        type: 'int'
    })
    authorId: number
    @ManyToOne(()=> Author , author => author.book, {onDelete: "SET NULL"})
    @JoinColumn({name: 'authorId'})
    author: Author;

    @OneToMany(()=>BookToSA, (bookToSa)=> bookToSa.book)
    sa: BookToSA[]

}