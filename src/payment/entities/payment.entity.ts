import { AbstractEntity } from '../../user/entities/abstract.entity';
import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { StatusPayment } from '../../enums/enums';
import { Reservation } from '../../reservation/entities/reservation.entity';

@Entity()
export class Payment extends AbstractEntity {

  @Column('decimal', { scale: 2 })
  amount: number

  @Column({ type:'enum', enum:StatusPayment, default:StatusPayment.PENDING})
  status: string

  @Column()
  paymentMode: string;

  @Column()
  datePayment: Date;

  @OneToOne(() => Reservation, reservation => reservation.payment, { cascade: true, eager: true })
  @JoinColumn()
  reservation: Reservation;

}
