import {Entity,Column, PrimaryGeneratedColumn } from "typeorm";

@Entity()
export class Appointments{

    @PrimaryGeneratedColumn()
    idAppointment : number;

    @Column()
    idDoctor : number;

    @Column()
    doctorname : string;

    @Column()
    appointmentdate : string;

    @Column()
    costappointment : number;

    @Column()
    appointmentStatus : number;

    @Column()
    IsFestive : string;

    @Column()
    idUser : number;

}