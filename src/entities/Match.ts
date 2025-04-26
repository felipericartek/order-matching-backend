import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity()
export class Match {
    @PrimaryGeneratedColumn()
    id: number;

    @Column('decimal', { precision: 18, scale: 8 })
    amount: number;

    @Column('decimal', { precision: 18, scale: 2 })
    price: number;

    @CreateDateColumn()
    createdAt: Date;
}
