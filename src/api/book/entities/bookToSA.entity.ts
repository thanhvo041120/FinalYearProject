import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryColumn, UpdateDateColumn } from "typeorm";
import { Book } from "./book.entity";
import { Borrow } from "./borrow.entity";

@Entity()
export class BookToSA{
    @PrimaryColumn({
        type: 'varchar',
        length: 255,
        nullable: false,
        unique: true
    })
    address: string;

    @Column({
        type: 'varchar',
        length: 255,
        nullable: false,
        unique: true
    })
    hashSA: string

    @Column({type: 'int'})
    bookId: number
    @ManyToOne(()=>Book, (book)=>book.sa)
    @JoinColumn({name: 'bookId'})
    book: Book

    @OneToMany(()=> Borrow, (borrow)=> borrow.bookToSA)
    borrows: Borrow[]

    @CreateDateColumn({name: 'createdAt'})
    createdAt: Date;

    @UpdateDateColumn({name: 'updatedAt'})
    updatedAt: Date;
}