import { Account } from "src/api/auth/entities";
import { CoreEntity } from "src/api/database/inherited.entity";
import { Column, Entity, JoinColumn, ManyToOne} from "typeorm";
import { BookToSA } from "./bookToSA.entity";

@Entity()
export class Borrow extends CoreEntity{
    @Column({type: 'int', nullable: false})
    accountId: number;
    @ManyToOne(()=>Account, (account)=>account.borrows)
    @JoinColumn({name: 'accountId'})
    account: Account;

    @Column({type: 'varchar', length: 255, nullable: false})
    bookToSAString: string;
    @ManyToOne(()=>BookToSA)
    @JoinColumn({name: 'bookToSAString'})
    bookToSA: BookToSA;

    @Column({
        type: 'varchar',
        nullable: false
    })
    bookName: string
    
    @Column({
        type: 'date',
        nullable: false
    })
    expDate: Date;
}