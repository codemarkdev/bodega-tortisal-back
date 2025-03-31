import { Employee } from "src/employees/entities/employee.entity";
import { MissingProduct } from "src/missing-products/entities/missing-product.entity";
import { ToolsIssued } from "src/tools-issued/entities/tools-issued.entity";
import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

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

      // Relación con ToolsIssued
     @OneToMany(() => ToolsIssued, (toolsIssued) => toolsIssued.shift)
    toolsIssued: ToolsIssued[];

    // Relación directa con MissingProduct (según diagrama)
    @OneToMany(() => MissingProduct, (missingProduct) => missingProduct.shift)
    missingProducts: MissingProduct[];
}
