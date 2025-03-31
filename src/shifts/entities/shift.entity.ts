import { Employee } from "src/employees/entities/employee.entity";
import { Column, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

@Entity('shifts')
export class Shift {

    @PrimaryGeneratedColumn({unsigned: true})
    id: number;

    @Column({ type: 'varchar',  nullable: false})
    check_in_time: string;

    @Column({ type: 'varchar',  nullable: true})
    check_out_time?: string;

    @ManyToOne(() => Employee, (employee) => employee.shifts, {onDelete: "CASCADE"})
    @JoinColumn({ name: 'id_employee'})
    employee: Employee;
}
