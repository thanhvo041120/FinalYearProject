import { Account } from "src/api/auth/entities";
import { CoreEntity } from "src/api/database/inherited.entity";
import { Column, Entity, OneToMany } from "typeorm";

@Entity()
export class Role extends CoreEntity {
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

    @OneToMany(()=>Account, (account) => account.role)
    accounts: Account[]
}