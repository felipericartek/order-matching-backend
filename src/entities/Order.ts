import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { User } from './User';

@Entity()
export class Order {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => User)
    user: User;

    @Column()
    type: 'BUY' | 'SELL';

    @Column('decimal', { precision: 18, scale: 8 })
    amount: number;

    @Column('decimal', { precision: 18, scale: 2 })
    price: number;

    @Column({ default: 'ACTIVE' })
    status: 'ACTIVE' | 'COMPLETED' | 'CANCELLED';

    @CreateDateColumn()
    createdAt: Date;
}
