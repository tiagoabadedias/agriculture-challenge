import { Entity, Column, PrimaryGeneratedColumn, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Harvest } from '../harvests/harvest.entity';
import { Farm } from '../farms/farm.entity';

@Entity('planted_cultures')
export class PlantedCulture {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  name: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  area: number;

  @Column()
  farmId: string;

  @ManyToOne(() => Farm)
  @JoinColumn({ name: 'farmId' })
  farm: Farm;

  @Column()
  harvestId: string;

  @ManyToOne(() => Harvest)
  @JoinColumn({ name: 'harvestId' })
  harvest: Harvest;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
