import { Shift } from "src/shifts/entities/shift.entity";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";

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

    @OneToMany(() => Shift, (shift) => shift.employee)
    shifts: Shift[];
}
