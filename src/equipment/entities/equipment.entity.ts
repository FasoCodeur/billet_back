import { AbstractEntity } from '../../user/entities/abstract.entity';
import { Column, Entity, ManyToOne } from 'typeorm';
import { Bus } from '../../bus/entities/bus.entity';

@Entity()
export class Equipment extends AbstractEntity {

  @Column()
  type: string;

  @ManyToOne(()=>Bus, (bus) => bus.equipment)
  bus: Bus;
}
