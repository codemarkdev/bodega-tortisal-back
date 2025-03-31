import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('products')
export class Product {
    @PrimaryGeneratedColumn({ unsigned: true })
    id: number;

    @Column({ type: 'varchar', length: 100, nullable: false })
    name: string;

    @Column({ type: 'varchar', length: 220, nullable: false })
    description: string;

    @Column( {type: 'decimal', precision: 10, scale: 2, nullable: false})
    purchase_price: number;

    @Column({ type: 'int', nullable: false })
    quantity: number;

    @Column({ type: 'boolean', nullable: false })
    is_consumable: boolean;
}