import { AbstractEntity } from '../../user/entities/abstract.entity';
import { Entity, ManyToOne } from 'typeorm';
import { Bus } from '../../bus/entities/bus.entity';

@Entity()
export class Equipment extends AbstractEntity {

  @ManyToOne(()=>Bus, (bus) => bus.equipment)
  bus: Bus;
}
