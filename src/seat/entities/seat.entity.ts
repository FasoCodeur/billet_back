import { AbstractEntity } from '../../user/entities/abstract.entity';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { Bus } from '../../bus/entities/bus.entity';
import { Reservation } from '../../reservation/entities/reservation.entity';

@Entity()
export class Seat extends AbstractEntity {

  @Column()
  number: string;

  @ManyToOne(() => Bus, (bus) => bus.sieges)
  bus: Bus;

  @OneToMany(() => Reservation, (reservation) => reservation.siege)
  reservations: Reservation[]; // Liaison avec les réservations

}
