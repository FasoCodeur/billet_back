import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';
import { AbstractEntity } from '../../user/entities/abstract.entity';
import { Company } from './company.entity';

@Entity()
export class Address extends AbstractEntity {
  @Column()
  city: string;

  @Column('decimal', { scale: 2, nullable: true })
  log: number;

  @Column('decimal', { scale: 2, nullable: true })
  lat: number;

  @OneToOne(() => Company, (company) => company.address, {
    cascade: true,
    onDelete: 'CASCADE',
    eager: true,
  })
  @JoinColumn()
  company: Company;
}
