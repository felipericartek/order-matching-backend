import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Order } from './Order';

@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id!: number;

    @Column({ unique: true })
    username!: string;

    @Column('decimal', { precision: 18, scale: 2, default: 100000 })
    usdBalance!: number;

    @Column('decimal', { precision: 18, scale: 8, default: 100 })
    btcBalance!: number;

    @OneToMany(() => Order, (order) => order.user)
    orders!: Order[];
}
