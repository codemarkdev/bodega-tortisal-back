import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('employees')
export class Employee {
    @PrimaryGeneratedColumn({unsigned: true})
    id: number

    @Column({ type: 'varchar', length: 256, nullable: false })
    firstname: string;

    @Column({ type: 'varchar', length: 256, nullable: false })
    lastname: string;

    @Column({ type: 'varchar', length: 256, nullable: true })
    dui: string;
}
