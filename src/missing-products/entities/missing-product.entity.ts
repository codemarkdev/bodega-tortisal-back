import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { ToolsIssued } from 'src/tools-issued/entities/tools-issued.entity';
import { Shift } from 'src/shifts/entities/shift.entity';
import { Product } from 'src/products/entities/product.entity';

@Entity('missing_products')
export class MissingProduct {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Shift)
  @JoinColumn({ name: 'id_shift'})
  shift: Shift;

  @ManyToOne(() => Product)
  @JoinColumn({ name: 'id_product' })
  product: Product;

  @ManyToOne(() => ToolsIssued, (toolsIssued) => toolsIssued.missingProducts)
  @JoinColumn({ name: 'id_tools_issued' })
  toolsIssued: ToolsIssued;

  @Column({ name: 'missing_quantity' })
  missing_quantity: number;
}