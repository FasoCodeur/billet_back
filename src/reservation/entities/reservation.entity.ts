import { AbstractEntity } from '../../user/entities/abstract.entity';
import { Column, Entity, ManyToOne, OneToOne } from 'typeorm';
import { StatusReservation } from '../../enums/enums';
import { Seat } from '../../seat/entities/seat.entity';
import { Payment } from '../../payment/entities/payment.entity';

@Entity()
export class Reservation extends AbstractEntity {
  @Column({nullable:true})
  customerName: string;

  @Column()
  customerPhone: string;

  @Column({ type:'enum', enum:StatusReservation, default:StatusReservation.PENDING})
  status: string

  @Column()
  seatNumber: number;

  @Column()
  reservationDate: Date;

  @ManyToOne(() => Seat, (siege) => siege.reservations)
  siege: Seat;

  @OneToOne(() => Payment, payment => payment.reservation)
  payment: Payment;
}
