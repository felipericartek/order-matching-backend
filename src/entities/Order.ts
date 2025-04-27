import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, CreateDateColumn } from 'typeorm';
import { User } from './User';

export enum OrderType {
    BUY = 'BUY',
    SELL = 'SELL',
}

export enum OrderStatus {
    ACTIVE = 'ACTIVE',
    COMPLETED = 'COMPLETED',
    CANCELLED = 'CANCELLED',
}

@Entity()
export class Order {
    @PrimaryGeneratedColumn()
    id!: number;

    @ManyToOne(() => User, { eager: true })
    user!: User;

    @Column({
        type: 'enum',
        enum: OrderType,
    })
    type!: OrderType;

    @Column('decimal', { precision: 18, scale: 8 })
    amount!: number;

    @Column('decimal', { precision: 18, scale: 2 })
    price!: number;

    @Column({
        type: 'enum',
        enum: OrderStatus,
        default: OrderStatus.ACTIVE,
    })
    status!: OrderStatus;

    @CreateDateColumn()
    createdAt!: Date;
}
