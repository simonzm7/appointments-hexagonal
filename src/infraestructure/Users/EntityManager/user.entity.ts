import { Entity, Column, PrimaryGeneratedColumn, Long } from "typeorm";


@Entity()
export class User {

    @PrimaryGeneratedColumn()
    userId : number;

    @Column()
    email : string;

    @Column()
    password : string;

    @Column()
    firstname : string;

    @Column()
    lastname : string;

    @Column()
    dni: string;

    @Column()
    balance: number;

    @Column()
    role : string;
}