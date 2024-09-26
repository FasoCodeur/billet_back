import { Column, Entity, ManyToOne, OneToOne } from 'typeorm';
import { AbstractEntity } from '../../user/entities/abstract.entity';
import { Address } from './address.entity';
import { User } from '../../user/entities/user.entity';

@Entity()
export class Company extends AbstractEntity {

  @Column()
  name: string;

  @Column()
  logo: string;

  @OneToOne(
    () => Address,
    (address) => address.company,
  )
  address: Address;

  @ManyToOne(()=>User, (user) => user.company)
  user: User;
}
