import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
    OneToMany,
  } from 'typeorm';
 import { Product } from 'src/products/entities/product.entity';
 import { Shift } from 'src/shifts/entities/shift.entity';
 import { MissingProduct } from 'src/missing-products/entities/missing-product.entity';
  
  @Entity('tools_issued')
  export class ToolsIssued {
    @PrimaryGeneratedColumn()
    id: number;
  
    @ManyToOne(() => Shift, (shift) => shift.toolsIssued)
    @JoinColumn({ name: 'id_shift' })
    shift: Shift;
  
    @ManyToOne(() => Product, (product) => product.toolsIssued)
    @JoinColumn({ name: 'id_product' })
    product: Product;
  
    @Column({ name: 'quantity_issued' })
    quantity_issued: number;
  
    @Column({ name: 'quantity_returned', nullable: true })
    quantity_returned: number;
  
    @OneToMany(() => MissingProduct, (missing) => missing.toolsIssued)
    missingProducts: MissingProduct[];
  }