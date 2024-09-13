import {Column, Entity, JoinColumn, OneToOne} from 'typeorm';
import { User } from './user.entity';
import { AbstractEntity } from './abstract.entity';

@Entity()
export class VerifyCodesEntity extends AbstractEntity {
  @Column({ nullable: true })
  emailVerificationCode: number;

  @Column({ type: 'timestamp', nullable: true })
  emailVerificationCodeExpiry: Date;

  @OneToOne(() => User, (user) => user.verificationCodes, {
    cascade: true,
    eager: true,
  })
  @JoinColumn()
  user: User;
}
