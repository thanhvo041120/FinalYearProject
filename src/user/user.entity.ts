import { Account } from "src/auth/account.entity";
import { CoreEntity } from "src/database/inherited.entity";
import { Column, Entity, OneToMany } from "typeorm";

@Entity()
export class User extends CoreEntity {
    @Column({
        type: 'varchar',
        length: 255,
        nullable: false
    })
    fullname: string;

    @Column({
        type: 'date',
        nullable: true
    })
    birthday: Date;

    @Column({
        type: 'varchar',
        length: 11,
        unique: true,
        nullable: false
    })
    phonenumber: string;

    @Column({
        type: 'varchar',
        length: 255,
        nullable: true
    })
    address: string;

    @OneToMany(()=> Account, (account)=> account.id)
    accounts: Account[]
}