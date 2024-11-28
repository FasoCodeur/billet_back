import { Column, Entity, ManyToOne, OneToMany, OneToOne } from 'typeorm';
import { AbstractEntity } from '../../user/entities/abstract.entity';
import { Address } from './address.entity';
import { User } from '../../user/entities/user.entity';
import { Bus } from '../../bus/entities/bus.entity';

@Entity()
export class Company extends AbstractEntity {
  @Column({ unique: true })
  name: string;

  @Column({ nullable: false })
  ice: string;

  @Column()
  phone: string;

  @Column({ nullable: true })
  email: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({ nullable: true })
  logo: string;

  @OneToOne(() => Address, (address) => address.company)
  address: Address;

  @ManyToOne(() => User, (user) => user.company)
  user: User;

  @OneToMany(() => Bus, (bus) => bus.company)
  bus: Bus[];
}
