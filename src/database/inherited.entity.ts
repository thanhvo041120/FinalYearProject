import { BaseEntity, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export abstract class CoreEntity extends BaseEntity{
    @Column({
        type: 'int',
        nullable: false
    })
    @PrimaryGeneratedColumn()
    id: number;

    
    @CreateDateColumn({name: 'createdAt'})
    createdAt: Date;

    @UpdateDateColumn({name: 'updatedAt'})
    updatedAt: Date;
}