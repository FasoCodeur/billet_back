import { AbstractEntity } from '../../user/entities/abstract.entity';
import { Column, Entity, ManyToOne } from 'typeorm';
import { Bus } from '../../bus/entities/bus.entity';

@Entity()
export class Trajet extends AbstractEntity {

  @Column({name : 'starting_point'})
  startingPoint:string;

  @Column({name : 'arrival_point'})
  arrivalPoint:string;

  @Column({name : 'departure_date'})
  departureDate:Date;

  @Column({name : 'arrival_date'})
  arrivalDate:Date;

  @Column('decimal', { scale: 2 })
  price: number;

  @Column()
  numberofplacesonsale:number;

  @Column({default: true})
  active:boolean

  @Column()
  companyUuid: string;

  @ManyToOne(()=>Bus, (bus) => bus.trajet)
  bus: Bus;

}
