import { Borrow } from "src/api/book/entities";
import { CoreEntity } from "src/api/database/inherited.entity";
import { Role } from "src/api/role/role.entity";
import { User } from "src/api/user/entities";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany } from "typeorm";
import { RefreshToken } from "./refreshToken.entity";

@Entity()
export class Account extends CoreEntity {
    @Column({
        type: 'varchar',
        length: 255,
        nullable: false,
        unique: true
    })
    email: string;

    @Column({
        type:'varchar',
        length: 255,
        nullable: false
    })
    password: string

    @Column({
        type:'varchar',
        length: 255,
        unique: true,
        nullable: false
    })
    walletAddress: string

    @Column({type: 'int', nullable: false})
    roleId: number;
    @ManyToOne(()=>Role, (role)=>role.accounts, {onDelete: 'CASCADE'})
    @JoinColumn({name: 'roleId'})
    role: Role;

    @Column({type: 'int', nullable: false})
    userId: number;
    @ManyToOne(()=> User , (user)=>user.accounts, {onDelete: 'CASCADE'})
    @JoinColumn({name: 'userId'})
    user: User

    @OneToMany(()=>RefreshToken, (refresh_token)=> refresh_token.token)
    tokens: RefreshToken[]

    @OneToMany(()=> Borrow, (borrow)=> borrow.account)
    borrows: Borrow[]
}