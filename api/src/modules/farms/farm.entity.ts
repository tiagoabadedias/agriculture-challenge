import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Producer } from '../producers/producer.entity';

@Entity('farms')
export class Farm {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column()
  city: string;

  @Column()
  state: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  totalArea: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  arableArea: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  vegetationArea: number;

  @Column()
  producerId: string;

  @ManyToOne(() => Producer)
  @JoinColumn({ name: 'producerId' })
  producer: Producer;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
