import { CoreEntity } from "src/api/database/inherited.entity";
import { Column, Entity, JoinColumn, ManyToOne } from "typeorm";
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

    @Column()
    accountId: number
    @ManyToOne(()=> Account, (account)=>account.tokens, {onDelete: 'CASCADE'})
    @JoinColumn({name: 'accountId'})
    account: Account
}