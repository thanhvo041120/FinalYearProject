import { CoreEntity } from "src/database/inherited.entity";
import { User } from "src/user/user.entity";
import { Column, Entity, ManyToOne, OneToMany } from "typeorm";
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
        nullable: true
    })
    password: string

    @ManyToOne(()=> User , (user)=>user.accounts)
    user: User

    @OneToMany(()=>RefreshToken, (refresh_token)=> refresh_token.token)
    tokens: RefreshToken[]
}