import { Column, Entity, OneToOne } from 'typeorm';
import { AbstractEntity } from './abstract.entity';
import { VerifyCodesEntity } from './verify-codes.entity';
import { UserRole } from './user-role.enum';

@Entity()
export class User extends AbstractEntity {

  @Column({ unique: true, nullable: true })
  email: string;

  @Column({ unique: true, nullable: true })
  phone: string;

  @Column({ select: false, nullable: true })
  password: string;

  @Column({ default: true })
  isActif: boolean;

  @Column({ type: 'enum', enum: UserRole, default: UserRole.VENDOR })
  role:UserRole[];

  @Column({ default: false })
  is_email_verified: boolean;
  @OneToOne(
    () => VerifyCodesEntity,
    (verificationCodes) => verificationCodes.user,
  )
  verificationCodes: VerifyCodesEntity;
}
