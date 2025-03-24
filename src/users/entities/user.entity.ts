import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

@Entity('users')
export class User {
    @PrimaryGeneratedColumn({unsigned: true})
    id: number;

    @Column({ type: 'varchar', unique: true, length: 50, nullable: false })
    username: string;

    @Column({ type: 'varchar', length: 200, nullable: false })
    password: string;

    @Column( {type: 'varchar', default: 'admin', nullable: false })
    role: string;
}
