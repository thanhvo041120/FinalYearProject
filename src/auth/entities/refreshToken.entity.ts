import { CoreEntity } from "src/database/inherited.entity";
import { Column, Entity, ManyToOne } from "typeorm";
import { Account } from "./account.entity";

@Entity()
export class RefreshToken extends CoreEntity{
    @Column({
        type: 'varchar',
        length: 1800
    })
    token: string;

    @Column({
        type: 'int',
        nullable: false
    })
    @ManyToOne(()=> Account, (account)=>account.id)
    account: number
}