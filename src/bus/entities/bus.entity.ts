import { AbstractEntity } from '../../user/entities/abstract.entity';
import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { Company } from '../../company/entities/company.entity';
import { Trajet } from '../../trajet/entities/trajet.entity';
import { Equipment } from '../../equipment/entities/equipment.entity';

@Entity()
export class Bus extends AbstractEntity {

  @Column()
  matriculation:string;

  @Column({nullable:true})
  numberOfSeats:number;

  @Column({nullable:true})
  typeOfBus:string;

  @ManyToOne(()=>Company, (company) => company.bus)
  company: Company;

  @OneToMany(()=>Trajet, (trajet) => trajet.bus)
  trajet: Trajet[]

  @OneToMany(()=>Equipment, (equipment) => equipment.bus)
  equipment: Equipment[]
}
